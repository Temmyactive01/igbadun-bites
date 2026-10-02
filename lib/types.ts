export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  pack_size: string;
  price_gbp: number;
  ingredients: string;
  allergens: string;
  storage_guidance: string;
  // Added in supabase/003_product_details.sql. "researched" = typical-recipe info we
  // researched, NOT yet confirmed by the owner/supplier; "confirmed" = owner signed off.
  // Missing (migration not yet run) is treated as "researched".
  details_status?: "researched" | "confirmed";
  available: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  status: "pending" | "paid" | "failed";
  paystack_reference: string | null;
  total_gbp: number;
  created_at: string;
  // Added in supabase/002_checkout_fields.sql
  currency: string;
  fulfilment: "pickup" | "delivery";
  customer_name: string | null;
  customer_email: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postcode: string | null;
  delivery_fee_gbp: number;
  paid_at: string | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_gbp: number;
};
