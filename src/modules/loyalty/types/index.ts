export type Movement = { id: string; title: string; points: number; date: string };

export type Reward = {
  id: string;
  title: string;
  shop: string;
  cost: number;
  icon: any; // Using any for LucideIcon for simplicity, could be React.ElementType
  description: string;
};
