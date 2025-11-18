import { ApiClient } from './client';
import type { CaptchaResult, LoginParams, LoginResult, UserInfo } from '../types/api';

/**
 * 获取验证�?
 */
export const getCaptchaApi = () => {
  return ApiClient.get<CaptchaResult>('/v1/auth/captcha');
};

/**
 * 用户登录
 */
export const loginApi = (params: LoginParams) => {
  return ApiClient.post<LoginResult>('/v1/auth/login', params);
};

/**
 * 用户登出
 */
export const logoutApi = () => {
  return ApiClient.post('/v1/auth/logout');
};

/**
 * 刷新 Token
 */
export const refreshTokenApi = (refreshToken: string) => {
  return ApiClient.post<{ access_token: string }>('/v1/auth/refresh', {
    refresh_token: refreshToken,
  });
};

/**
 * 获取用户信息
 */
export const getUserInfoApi = () => {
  return ApiClient.get<UserInfo>('/v1/auth/userinfo');
};

/**
 * 获取权限�?
 */
export const getAccessCodesApi = () => {
  return ApiClient.get<string[]>('/v1/auth/access-codes');
};
