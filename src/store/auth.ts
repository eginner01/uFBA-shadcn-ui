import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '../types/api';
import { loginApi, logoutApi, getUserInfoApi, getAccessCodesApi } from '../api/auth';

interface AuthState {
  token: string | null;
  sessionUuid: string | null;
  userInfo: UserInfo | null;
  accessCodes: string[];
  isAuthenticated: boolean;
  
  // Actions
  setToken: (token: string, sessionUuid: string) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setAccessCodes: (codes: string[]) => void;
  login: (username: string, password: string, captcha: string, uuid: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserInfo: () => Promise<UserInfo>;
  checkAuth: () => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      sessionUuid: null,
      userInfo: null,
      accessCodes: [],
      isAuthenticated: false,

      setToken: (token, sessionUuid) => {
        console.log('[Auth Store] Setting token:', token ? `${token.substring(0, 20)}...` : 'null');
        console.log('[Auth Store] Setting session_uuid:', sessionUuid);
        
        localStorage.setItem('access_token', token);
        localStorage.setItem('session_uuid', sessionUuid);
        set({ token, sessionUuid, isAuthenticated: true });
        
        // 验证保存
        const savedToken = localStorage.getItem('access_token');
        console.log('[Auth Store] Token saved successfully:', savedToken ? `${savedToken.substring(0, 20)}...` : 'null');
      },

      setUserInfo: (userInfo) => {
        set({ userInfo });
      },

      setAccessCodes: (codes) => {
        set({ accessCodes: codes });
      },

      login: async (username, password, captcha, uuid) => {
        try {
          // 1. 登录获取token
          const loginResult = await loginApi({ username, password, captcha, uuid });
          const { access_token, session_uuid } = loginResult;

          // 2. 保存token
          get().setToken(access_token, session_uuid);

          // 3. 获取用户信息和权限码
          const [userInfo, accessCodes] = await Promise.all([
            getUserInfoApi(),
            getAccessCodesApi(),
          ]);

          // 4. 保存用户信息和权�?
          get().setUserInfo(userInfo);
          get().setAccessCodes(accessCodes);
        } catch (error) {
          // 清除状�?
          set({
            token: null,
            sessionUuid: null,
            userInfo: null,
            accessCodes: [],
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await logoutApi();
        } finally {
          // 清除所有状�?
          localStorage.removeItem('access_token');
          localStorage.removeItem('session_uuid');
          set({
            token: null,
            sessionUuid: null,
            userInfo: null,
            accessCodes: [],
            isAuthenticated: false,
          });
        }
      },

      fetchUserInfo: async () => {
        const userInfo = await getUserInfoApi();
        get().setUserInfo(userInfo);
        return userInfo;
      },

      checkAuth: () => {
        const { token, isAuthenticated } = get();
        return !!token && isAuthenticated;
      },

      hasPermission: (permission) => {
        const { accessCodes, userInfo } = get();
        // 超级管理员拥有所有权�?
        if (userInfo?.is_superuser) return true;
        return accessCodes.includes(permission);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        sessionUuid: state.sessionUuid,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
