import "server-only";

// Sends email through Mailgun's HTTP API. US region (api.mailgun.net) by default;
// set MAILGUN_BASE_URL=https://api.eu.mailgun.net if the account moves to the EU.
//
// While MAILGUN_DOMAIN is the sandbox domain, Mailgun only delivers to addresses
// listed as "Authorized Recipients" on that sandbox.
export async function sendEmail(message: { to: string; subject: string; html: string; text: string }) {
  const domain = process.env.MAILGUN_DOMAIN;
  const key = process.env.MAILGUN_API_KEY;
  if (!domain || !key) throw new Error("Mailgun is not configured (MAILGUN_DOMAIN / MAILGUN_API_KEY missing)");

  const base = process.env.MAILGUN_BASE_URL ?? "https://api.mailgun.net";
  const res = await fetch(`${base}/v3/${domain}/messages`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`api:${key}`).toString("base64")}` },
    body: new URLSearchParams({
      from: `Igbadun Bites <orders@${domain}>`,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });

  if (!res.ok) throw new Error(`Mailgun send failed: ${res.status} ${await res.text()}`);
}
