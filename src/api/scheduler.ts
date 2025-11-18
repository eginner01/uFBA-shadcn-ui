import { ApiClient } from './client';
import type { PageParams, PageResult } from '../types/api';

export interface TaskScheduler {
  id: number;
  name: string;
  job_class: string;
  cron: string;
  status: number;
  remark?: string;
  next_run_time?: string;
  created_time: string;
  updated_time?: string;
}

export interface TaskResult {
  id: number;
  task_id: string;
  name: string;
  status: number;
  result?: string;
  error?: string;
  start_time: string;
  end_time?: string;
  duration?: number;
}

export interface CreateSchedulerParams {
  name: string;
  job_class: string;
  cron: string;
  status: number;
  remark?: string;
}

export interface SchedulerParams extends Partial<PageParams> {
  name?: string;
  status?: number;
}

/**
 * 获取任务调度列表
 */
export const getSchedulerListApi = (params: SchedulerParams) => {
  return ApiClient.get<PageResult<TaskScheduler>>('/v1/tasks/schedulers', { params });
};

/**
 * 获取所有任务调�?
 */
export const getAllSchedulersApi = () => {
  return ApiClient.get<TaskScheduler[]>('/v1/tasks/schedulers/all');
};

/**
 * 创建任务调度
 */
export const createSchedulerApi = (data: CreateSchedulerParams) => {
  return ApiClient.post('/v1/tasks/schedulers', data);
};

/**
 * 更新任务调度
 */
export const updateSchedulerApi = (id: number, data: CreateSchedulerParams) => {
  return ApiClient.put(`/v1/tasks/schedulers/${id}`, data);
};

/**
 * 更新任务状�?
 */
export const updateSchedulerStatusApi = (id: number) => {
  return ApiClient.put(`/v1/tasks/schedulers/${id}/status`);
};

/**
 * 删除任务调度
 */
export const deleteSchedulerApi = (id: number) => {
  return ApiClient.delete(`/v1/tasks/schedulers/${id}`);
};

/**
 * 立即执行任务
 */
export const executeSchedulerApi = (id: number) => {
  return ApiClient.post(`/v1/tasks/schedulers/${id}/executions`);
};

/**
 * 获取任务执行记录
 */
export const getTaskResultsApi = (params: Partial<PageParams>) => {
  return ApiClient.get<PageResult<TaskResult>>('/v1/tasks/results', { params });
};

/**
 * 删除任务执行记录
 */
export const deleteTaskResultsApi = (ids: number[]) => {
  return ApiClient.delete('/v1/tasks/results', { data: { pks: ids } });
};

/**
 * 获取已注册的任务列表
 */
export const getRegisteredTasksApi = () => {
  return ApiClient.get<string[]>('/v1/tasks/registered');
};
