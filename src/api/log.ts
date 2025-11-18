import { ApiClient } from './client';
import type { PageParams, PageResult } from '../types/api';

export interface LoginLog {
  id: number;
  username: string;
  ip: string;
  location?: string;
  browser?: string;
  os?: string;
  status: number;
  msg?: string;
  login_time: string;
}

export interface OperaLog {
  id: number;
  username: string;
  method: string;
  title: string;
  ip: string;
  status: number;
  code: number;
  msg?: string;
  cost_time: number;
  opera_time: string;
}

export interface LoginLogParams extends Partial<PageParams> {
  username?: string;
  ip?: string;
  status?: number;
}

export interface OperaLogParams extends Partial<PageParams> {
  username?: string;
  title?: string;
  status?: number;
}

/**
 * 获取登录日志列表
 */
export const getLoginLogListApi = (params: LoginLogParams) => {
  return ApiClient.get<PageResult<LoginLog>>('/v1/logs/login', { params });
};

/**
 * 删除登录日志
 */
export const deleteLoginLogApi = (ids: number[]) => {
  return ApiClient.delete('/v1/logs/login', { data: { pks: ids } });
};

/**
 * 获取操作日志列表
 */
export const getOperaLogListApi = (params: OperaLogParams) => {
  return ApiClient.get<PageResult<OperaLog>>('/v1/logs/opera', { params });
};

/**
 * 删除操作日志
 */
export const deleteOperaLogApi = (ids: number[]) => {
  return ApiClient.delete('/v1/logs/opera', { data: { pks: ids } });
};
