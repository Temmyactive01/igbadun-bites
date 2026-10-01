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
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_gbp: number;
};
