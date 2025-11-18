import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // 主题
  theme: 'dark' | 'light';
  // 语言
  locale: 'zh-CN' | 'en-US';
  // 侧边栏折�?
  sidebarCollapsed: boolean;
  // 页面加载状�?
  loading: boolean;
  // 面包�?
  breadcrumbs: Array<{ title: string; path: string }>;
  
  // Actions
  setTheme: (theme: 'dark' | 'light') => void;
  setLocale: (locale: 'zh-CN' | 'en-US') => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  setBreadcrumbs: (breadcrumbs: Array<{ title: string; path: string }>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      locale: 'zh-CN',
      sidebarCollapsed: false,
      loading: false,
      breadcrumbs: [],

      setTheme: (theme) => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        set({ theme });
      },

      setLocale: (locale) => {
        localStorage.setItem('locale', locale);
        set({ locale });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setBreadcrumbs: (breadcrumbs) => {
        set({ breadcrumbs });
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        locale: state.locale,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
