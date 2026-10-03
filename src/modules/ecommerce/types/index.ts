export type Product = {
  id: string;
  name: string;
  shop: string;
  price: number;
  stock: number;
  category: string;
  image: string;
};

export type Order = {
  id: string;
  items: { product: Product; quantity: number }[];
  total: number;
  state: number;
  pin: string;
  slot: string;
  date: string;
  payment: string;
};
