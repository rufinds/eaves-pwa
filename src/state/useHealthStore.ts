import { create } from 'zustand';
import { checkDatabaseConnection } from '../services/healthService';

interface HealthState {
  /** null while the first check is running. */
  isDatabaseOnline: boolean | null;
  checkConnection: () => Promise<void>;
}

export const useHealthStore = create<HealthState>((set) => ({
  isDatabaseOnline: null,
  checkConnection: async () => {
    set({ isDatabaseOnline: await checkDatabaseConnection() });
  },
}));
