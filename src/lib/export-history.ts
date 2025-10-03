// src/lib/export-history.ts

import { ExportHistoryItem } from "@/app/types/export";

const HISTORY_KEY = "batiku-export-history";
const MAX_HISTORY_ITEMS = 20;

export const exportHistory = {
  /**
   * Simpan export ke history
   */
  save: (item: Omit<ExportHistoryItem, "id" | "timestamp">): void => {
    try {
      const history = exportHistory.getAll();
      const newItem: ExportHistoryItem = {
        ...item,
        id: `export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      };

      // Tambah di awal array
      history.unshift(newItem);

      // Limit ke MAX_HISTORY_ITEMS
      const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);

      localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error("Error saving export history:", error);
    }
  },

  /**
   * Ambil semua history
   */
  getAll: (): ExportHistoryItem[] => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading export history:", error);
      return [];
    }
  },

  /**
   * Ambil history berdasarkan ID
   */
  getById: (id: string): ExportHistoryItem | null => {
    const history = exportHistory.getAll();
    return history.find((item) => item.id === id) || null;
  },

  /**
   * Hapus satu item
   */
  deleteById: (id: string): void => {
    try {
      const history = exportHistory.getAll();
      const filtered = history.filter((item) => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting export history:", error);
    }
  },

  /**
   * Clear semua history
   */
  clear: (): void => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error("Error clearing export history:", error);
    }
  },

  /**
   * Get history count
   */
  count: (): number => {
    return exportHistory.getAll().length;
  },
};
