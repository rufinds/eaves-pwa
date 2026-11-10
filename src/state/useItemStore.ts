import { create } from 'zustand';
import { getItemById, getItems } from '../services/itemService';
import type { Item } from '../types/Item';

interface ItemState {
  items: Item[];
  current: Item | null;
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  loadItem: (id: string) => Promise<void>;
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong';
}

export const useItemStore = create<ItemState>((set) => ({
  items: [],
  current: null,
  isLoading: false,
  error: null,
  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await getItems();
      set({ items, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: toMessage(error) });
    }
  },
  loadItem: async (id) => {
    set({ current: null, isLoading: true, error: null });
    try {
      const current = await getItemById(id);
      set({ current, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: toMessage(error) });
    }
  },
}));
