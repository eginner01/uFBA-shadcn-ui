import axios, { type AxiosInstance } from 'axios';

// 创建自定义的 axios 实例类型，响应已经被拦截器处理过
interface CustomAxiosInstance extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete' | 'patch'> {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
}

const apiClient = axios.create({
  baseURL: '/api',  // 设置为/api，API路径为/v1/...
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}) as CustomAxiosInstance;

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // 直接返回响应数据，不做特殊处理
    // 如果后端返回格式为 { code, data, msg }，在这里统一处理
    if (response.data && typeof response.data === 'object') {
      const { data, code, msg } = response.data;
      if (code === 200) {
        return data;
      }
      // 其他code视为错误
      if (code !== undefined) {
        return Promise.reject(new Error(msg || 'Request failed'));
      }
    }
    // 如果不是标准格式，直接返回data
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('session_uuid');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 命名导出（供其他API文件使用）
export const ApiClient = apiClient;

// 默认导出（向后兼容）
export default apiClient;
