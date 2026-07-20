// ═══════════════════════════════════════════════════════════════
// LOGOS — Zustand Store
// localStorage for guests, Supabase for signed-in users
// ═══════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  supabase, 
  getUser, 
  savePrompt as dbSavePrompt, 
  getPrompts as dbGetPrompts, 
  deletePrompt as dbDeletePrompt,
  addToHistory as dbAddToHistory,
  getHistory as dbGetHistory,
  clearHistory as dbClearHistory,
  onAuthStateChange
} from './lib/supabase';

export const useStore = create(
  persist(
    (set, get) => ({
      // ── Auth State ──
      user: null,
      loading: true,
      setUser: (user) => set({ user, loading: false }),
      
      // ── Active Prompt ──
      activePrompt: null,
      setActivePrompt: (prompt) => set({ activePrompt: prompt }),

      // ── Modality ──
      modality: 'text',
      setModality: (modality) => set({ modality }),

      // ── Optimization History ──
      history: [],
      addToHistory: async (entry) => {
        const newEntry = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...entry,
        };

        // Update local state immediately
        set((state) => ({
          history: [newEntry, ...state.history].slice(0, 100),
        }));

        // Sync to Supabase if authenticated
        const user = get().user;
        if (user) {
          await dbAddToHistory(entry);
        }
      },
      
      clearHistory: async () => {
        set({ history: [] });
        const user = get().user;
        if (user) {
          await dbClearHistory();
        }
      },

      // ── Saved Prompts ──
      savedPrompts: [],
      savePrompt: async (prompt) => {
        const newPrompt = {
          id: Date.now(),
          savedAt: new Date().toISOString(),
          ...prompt,
        };

        // Update local state immediately
        set((state) => ({
          savedPrompts: [newPrompt, ...state.savedPrompts],
        }));

        // Sync to Supabase if authenticated
        const user = get().user;
        if (user) {
          await dbSavePrompt(prompt);
        }
      },
      
      deletePrompt: async (id) => {
        set((state) => ({
          savedPrompts: state.savedPrompts.filter((p) => p.id !== id),
        }));
        
        const user = get().user;
        if (user) {
          await dbDeletePrompt(id);
        }
      },

      // ── Sync from Supabase on login ──
      syncFromCloud: async () => {
        const user = get().user;
        if (!user) return;

        const { data: prompts } = await dbGetPrompts();
        const { data: history } = await dbGetHistory();

        if (prompts) {
          set({ savedPrompts: prompts });
        }
        if (history) {
          set({ history });
        }
      },

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

// ── Initialize auth listener ──
if (typeof window !== 'undefined') {
  onAuthStateChange(async (event, user) => {
    useStore.getState().setUser(user);
    
    if (event === 'SIGNED_IN' && user) {
      // Sync data from cloud when user signs in
      await useStore.getState().syncFromCloud();
    }
  });
}
