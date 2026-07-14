// ═══════════════════════════════════════════════════════════════
// LOGOS — Zustand Store
// Local state + localStorage persistence
// ═══════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // ── Active Prompt ──
      activePrompt: null,
      setActivePrompt: (prompt) => set({ activePrompt: prompt }),

      // ── Modality ──
      modality: 'text',
      setModality: (modality) => set({ modality }),

      // ── Optimization History ──
      history: [],
      addToHistory: (entry) => set((state) => ({
        history: [
          {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...entry,
          },
          ...state.history,
        ].slice(0, 100), // Keep last 100
      })),
      clearHistory: () => set({ history: [] }),

      // ── Saved Prompts ──
      savedPrompts: [],
      savePrompt: (prompt) => set((state) => ({
        savedPrompts: [
          {
            id: Date.now(),
            savedAt: new Date().toISOString(),
            ...prompt,
          },
          ...state.savedPrompts,
        ],
      })),
      deletePrompt: (id) => set((state) => ({
        savedPrompts: state.savedPrompts.filter((p) => p.id !== id),
      })),

      // ── Version Control ──
      versions: {},
      addVersion: (promptId, version) => set((state) => ({
        versions: {
          ...state.versions,
          [promptId]: [
            ...(state.versions[promptId] || []),
            {
              id: Date.now(),
              timestamp: new Date().toISOString(),
              ...version,
            },
          ],
        },
      })),
      getVersions: (promptId) => get().versions[promptId] || [],

      // ── UI State ──
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'logos-storage',
      partialize: (state) => ({
        history: state.history,
        savedPrompts: state.savedPrompts,
        versions: state.versions,
        modality: state.modality,
      }),
    }
  )
);
