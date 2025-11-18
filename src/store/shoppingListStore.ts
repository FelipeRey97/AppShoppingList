import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ShoppingList, Item } from '@/models/ShoppingList';
import { StorageService } from '@/services/StorageService';

export const useShoppingListStore = defineStore('shoppingList', () => {
  // State
  const lists = ref<ShoppingList[]>([]);
  const currentListId = ref<string | null>(null);

  // Getters
  const currentList = computed(() => {
    if (!currentListId.value) return null;
    return lists.value.find(list => list.id === currentListId.value) || null;
  });

  const getListById = (id: string) => {
    return lists.value.find(list => list.id === id);
  };

  const sortedLists = computed(() => {
    return [...lists.value].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  });

  // Actions
  function loadLists() {
    lists.value = StorageService.getAllLists();
  }

  function createList(name: string, category: string) {
    const newList = StorageService.createList(name, category);
    lists.value.push(newList);
    return newList;
  }

  function updateList(id: string, updates: Partial<ShoppingList>) {
    const updatedList = StorageService.updateList(id, updates);
    if (updatedList) {
      const index = lists.value.findIndex(list => list.id === id);
      if (index !== -1) {
        lists.value[index] = updatedList;
      }
    }
    return updatedList;
  }

  function deleteList(id: string) {
    const success = StorageService.deleteList(id);
    if (success) {
      lists.value = lists.value.filter(list => list.id !== id);
      if (currentListId.value === id) {
        currentListId.value = null;
      }
    }
    return success;
  }

  function setCurrentList(id: string | null) {
    currentListId.value = id;
  }

  function addItem(listId: string, name: string, quantity: number) {
    const newItem = StorageService.addItem(listId, name, quantity);
    if (newItem) {
      const list = lists.value.find(l => l.id === listId);
      if (list) {
        list.items.push(newItem);
        list.updatedAt = new Date();
      }
    }
    return newItem;
  }

  function updateItem(listId: string, itemId: string, updates: Partial<Item>) {
    const updatedItem = StorageService.updateItem(listId, itemId, updates);
    if (updatedItem) {
      const list = lists.value.find(l => l.id === listId);
      if (list) {
        const itemIndex = list.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          list.items[itemIndex] = updatedItem;
        }
        list.updatedAt = new Date();
      }
    }
    return updatedItem;
  }

  function deleteItem(listId: string, itemId: string) {
    const success = StorageService.deleteItem(listId, itemId);
    if (success) {
      const list = lists.value.find(l => l.id === listId);
      if (list) {
        list.items = list.items.filter(item => item.id !== itemId);
        list.updatedAt = new Date();
      }
    }
    return success;
  }

  function toggleItemCompleted(listId: string, itemId: string) {
    const updatedItem = StorageService.toggleItemCompleted(listId, itemId);
    if (updatedItem) {
      const list = lists.value.find(l => l.id === listId);
      if (list) {
        const item = list.items.find(i => i.id === itemId);
        if (item) {
          item.completed = updatedItem.completed;
        }
        list.updatedAt = new Date();
      }
    }
    return updatedItem;
  }

  function initializeSampleData() {
    StorageService.initializeSampleData();
    loadLists();
  }

  return {
    // State
    lists,
    currentListId,
    // Getters
    currentList,
    sortedLists,
    getListById,
    // Actions
    loadLists,
    createList,
    updateList,
    deleteList,
    setCurrentList,
    addItem,
    updateItem,
    deleteItem,
    toggleItemCompleted,
    initializeSampleData
  };
});
