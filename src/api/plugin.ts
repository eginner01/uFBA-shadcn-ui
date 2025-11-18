import { ApiClient } from './client';

export interface PluginResult {
  [key: string]: any;
}

export const getPluginListApi = async () => {
  return ApiClient.get<PluginResult[]>('/v1/sys/plugins');
};

export const getPluginChangedApi = async () => {
  return ApiClient.get<boolean>('/v1/sys/plugins/changed');
};

export const installZipPluginApi = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return ApiClient.post('/v1/sys/plugins', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: { type: 'zip' },
  });
};

export const installGitPluginApi = async (repoUrl: string) => {
  return ApiClient.post('/v1/sys/plugins', undefined, {
    params: { type: 'git', repo_url: repoUrl },
  });
};

export const updatePluginStatusApi = async (plugin: string) => {
  return ApiClient.put(`/v1/sys/plugins/${plugin}/status`);
};

export const downloadPluginApi = async (plugin: string) => {
  return ApiClient.get(`/v1/sys/plugins/${plugin}`, { responseType: 'blob' });
};

export const uninstallPluginApi = async (plugin: string) => {
  return ApiClient.delete(`/v1/sys/plugins/${plugin}`);
};
