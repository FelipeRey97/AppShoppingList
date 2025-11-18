export interface Item {
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
  createdAt: Date;
}

export interface ShoppingList {
  id: string;
  name: string;
  category: string;
  items: Item[];
  createdAt: Date;
  updatedAt: Date;
}

export type CategoryType = 'Mercado' | 'Hogar' | 'Electrónica' | 'Farmacia' | 'Otros';
