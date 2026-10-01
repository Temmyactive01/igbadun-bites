// Step 2 check: run with `npm run check:db`.
// Confirms the app can reach Supabase, the catalog is seeded, and RLS blocks public writes.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let failed = false;
const pass = (msg) => console.log(`  PASS  ${msg}`);
const fail = (msg) => {
  failed = true;
  console.log(`  FAIL  ${msg}`);
};

const publicClient = createClient(url, anonKey);
const adminClient = createClient(url, secretKey, { auth: { persistSession: false } });

// 1. Public key can read the catalog
const { data: products, error: readError } = await publicClient
  .from("products")
  .select("name, category, pack_size, price_gbp")
  .order("category")
  .order("name");
if (readError) fail(`public read: ${readError.message}`);
else if (products.length !== 13) fail(`expected 13 products, found ${products.length}`);
else pass("public key can read all 13 products");

// 2. Public key can NOT write (Row Level Security)
const { error: writeError } = await publicClient
  .from("products")
  .insert({ name: "RLS test", category: "Chips", description: "x", pack_size: "1g", price_gbp: 1 });
if (writeError?.code === "42501") pass("public key is blocked from inserting products (RLS on)");
else if (writeError) fail(`insert failed for an unexpected reason: ${writeError.message}`);
else {
  fail("public key was able to INSERT a product — RLS is not protecting the table");
  await adminClient.from("products").delete().eq("name", "RLS test");
}

// 3. Secret key works (needed later for writing orders)
const { count, error: adminError } = await adminClient.from("products").select("*", { count: "exact", head: true });
if (adminError) fail(`secret key: ${adminError.message}`);
else pass(`secret key works (sees ${count} products)`);

if (products?.length) {
  console.log("\nCatalog:");
  for (const p of products) console.log(`  £${Number(p.price_gbp).toFixed(2).padStart(5)}  ${p.name.padEnd(22)} ${p.pack_size.padEnd(5)} ${p.category}`);
}

process.exit(failed ? 1 : 0);
