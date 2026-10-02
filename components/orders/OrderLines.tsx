import { formatPence } from "@/lib/money";
import ItemThumb from "./ItemThumb";

export type OrderLine = {
  name: string;
  packSize?: string;
  category?: string;
  quantity: number;
  unitPence: number;
};

// The list of items in an order — shared by the checkout summary, the order
// confirmation and order history so all three read the same way.
export default function OrderLines({ lines, className = "" }: { lines: OrderLine[]; className?: string }) {
  return (
    <ul className={`divide-y divide-cocoa/10 ${className}`}>
      {lines.map((line, i) => (
        <li key={`${line.name}-${i}`} className="flex items-center gap-4 py-4">
          <ItemThumb name={line.name} category={line.category} className="h-14 w-14" />
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-lg leading-snug">{line.name}</span>
            <span className="block text-sm text-cocoa-soft">
              {line.quantity} × {formatPence(line.unitPence)}
              {line.packSize ? ` · ${line.packSize}` : ""}
            </span>
          </span>
          <span className="font-medium tabular-nums">{formatPence(line.unitPence * line.quantity)}</span>
        </li>
      ))}
    </ul>
  );
}
