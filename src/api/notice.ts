import { ApiClient } from './client';
import type { PageParams, PageResult } from '../types/api';

export interface Notice {
  id: number;
  title: string;
  type: number;
  status: number;
  content: string;
  created_time: string;
  updated_time?: string;
}

export interface NoticeQueryParams extends Partial<PageParams> {
  title?: string;
  type?: number;
  status?: number;
}

export interface CreateNoticeParams {
  title: string;
  type: number;
  status: number;
  content: string;
}

/**
 * 获取通知公告列表
 */
export const getNoticeListApi = (params: NoticeQueryParams) => {
  return ApiClient.get<PageResult<Notice>>('/v1/sys/notices', { params });
};

/**
 * 获取通知公告详情
 */
export const getNoticeDetailApi = (id: number) => {
  return ApiClient.get<Notice>(`/v1/sys/notices/${id}`);
};

/**
 * 创建通知公告
 */
export const createNoticeApi = (data: CreateNoticeParams) => {
  return ApiClient.post('/v1/sys/notices', data);
};

/**
 * 更新通知公告
 */
export const updateNoticeApi = (id: number, data: CreateNoticeParams) => {
  return ApiClient.put(`/v1/sys/notices/${id}`, data);
};

/**
 * 删除通知公告
 */
export const deleteNoticeApi = (ids: number[]) => {
  return ApiClient.delete('/v1/sys/notices', { data: { pks: ids } });
};
