import type { ShoppingList, Item } from '@/models/ShoppingList';

const STORAGE_KEY = 'shopping_lists';

export class StorageService {
  // Obtener todas las listas
  static getAllLists(): ShoppingList[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const lists = JSON.parse(data);
    // Convertir strings de fecha a objetos Date
    return lists.map((list: any) => ({
      ...list,
      createdAt: new Date(list.createdAt),
      updatedAt: new Date(list.updatedAt),
      items: list.items.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }))
    }));
  }

  // Guardar todas las listas
  static saveLists(lists: ShoppingList[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }

  // Obtener lista por ID
  static getListById(id: string): ShoppingList | undefined {
    const lists = this.getAllLists();
    return lists.find(list => list.id === id);
  }

  // Crear nueva lista
  static createList(name: string, category: string): ShoppingList {
    const lists = this.getAllLists();
    const newList: ShoppingList = {
      id: this.generateId(),
      name,
      category,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    lists.push(newList);
    this.saveLists(lists);
    return newList;
  }

  // Actualizar lista
  static updateList(id: string, updates: Partial<ShoppingList>): ShoppingList | null {
    const lists = this.getAllLists();
    const index = lists.findIndex(list => list.id === id);

    if (index === -1) return null;

    lists[index] = {
      ...lists[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveLists(lists);
    return lists[index];
  }

  // Eliminar lista
  static deleteList(id: string): boolean {
    const lists = this.getAllLists();
    const filtered = lists.filter(list => list.id !== id);

    if (filtered.length === lists.length) return false;

    this.saveLists(filtered);
    return true;
  }

  // Agregar item a una lista
  static addItem(listId: string, name: string, quantity: number): Item | null {
    const lists = this.getAllLists();
    const list = lists.find(l => l.id === listId);

    if (!list) return null;

    const newItem: Item = {
      id: this.generateId(),
      name,
      quantity,
      completed: false,
      createdAt: new Date()
    };

    list.items.push(newItem);
    list.updatedAt = new Date();
    this.saveLists(lists);

    return newItem;
  }

  // Actualizar item
  static updateItem(listId: string, itemId: string, updates: Partial<Item>): Item | null {
    const lists = this.getAllLists();
    const list = lists.find(l => l.id === listId);

    if (!list) return null;

    const itemIndex = list.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return null;

    list.items[itemIndex] = {
      ...list.items[itemIndex],
      ...updates
    };

    list.updatedAt = new Date();
    this.saveLists(lists);

    return list.items[itemIndex];
  }

  // Eliminar item
  static deleteItem(listId: string, itemId: string): boolean {
    const lists = this.getAllLists();
    const list = lists.find(l => l.id === listId);

    if (!list) return false;

    const initialLength = list.items.length;
    list.items = list.items.filter(item => item.id !== itemId);

    if (list.items.length === initialLength) return false;

    list.updatedAt = new Date();
    this.saveLists(lists);
    return true;
  }

  // Toggle completado de item
  static toggleItemCompleted(listId: string, itemId: string): Item | null {
    const lists = this.getAllLists();
    const list = lists.find(l => l.id === listId);

    if (!list) return null;

    const item = list.items.find(i => i.id === itemId);
    if (!item) return null;

    item.completed = !item.completed;
    list.updatedAt = new Date();
    this.saveLists(lists);

    return item;
  }

  // Generar ID único
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Inicializar datos de ejemplo (solo si no hay datos)
  static initializeSampleData(): void {
    const existingLists = this.getAllLists();
    if (existingLists.length > 0) return;

    const sampleLists: ShoppingList[] = [
      {
        id: this.generateId(),
        name: 'Ropa',
        category: 'Hogar',
        items: [
          {
            id: this.generateId(),
            name: 'Camisa',
            quantity: 1,
            completed: false,
            createdAt: new Date()
          },
          {
            id: this.generateId(),
            name: 'Medias',
            quantity: 3,
            completed: false,
            createdAt: new Date()
          },
          {
            id: this.generateId(),
            name: 'Pantalón',
            quantity: 1,
            completed: false,
            createdAt: new Date()
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateId(),
        name: 'Medicamentos',
        category: 'Farmacia',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateId(),
        name: 'Herramientas',
        category: 'Hogar',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateId(),
        name: 'Comida',
        category: 'Mercado',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.saveLists(sampleLists);
  }
}
