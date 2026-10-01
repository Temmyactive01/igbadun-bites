// Formats whole pence as pounds, e.g. 450 -> "£4.50". Safe to use on server and client.
export function formatPence(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}
