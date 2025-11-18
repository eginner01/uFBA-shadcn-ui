import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUserMenusApi, type SidebarMenu } from '../api/menu';

interface MenuState {
  menus: SidebarMenu[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchMenus: () => Promise<void>;
  clearMenus: () => void;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      menus: [],
      loading: false,
      error: null,

      fetchMenus: async () => {
        set({ loading: true, error: null });
        try {
          console.log('[Menu Store] Fetching user menus...');
          const menus = await getUserMenusApi();
          console.log('[Menu Store] Menus fetched:', menus.length, 'items');
          console.log('[Menu Store] Menu data:', menus);
          set({ menus, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '获取菜单失败';
          set({ error: errorMessage, loading: false });
          console.error('[Menu Store] Failed to fetch menus:', error);
        }
      },

      clearMenus: () => {
        set({ menus: [], error: null });
      },
    }),
    {
      name: 'menu-storage',
      partialize: (state) => ({ menus: state.menus }),
    }
  )
);
