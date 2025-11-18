import { ApiClient } from './client';

// 字典类型相关接口
export interface DictTypeParams {
  name?: string;
  code?: string;
  status?: number;
  page?: number;
  size?: number;
}

export interface DictTypeResult {
  id: number;
  name: string;
  code: string;
  status: number;
  remark?: string;
  created_time: string;
  updated_time?: string;
}

export interface CreateDictTypeParams {
  name: string;
  code: string;
  status: number;
  remark?: string;
}

// 字典数据相关接口
export interface DictDataParams {
  type_id?: number;
  label?: string;
  status?: number;
}

export interface DictDataResult {
  id: number;
  type_id: number;
  label: string;
  value: string;
  color?: string;
  sort: number;
  status: number;
  remark?: string;
}

export interface CreateDictDataParams {
  type_id: number;
  label: string;
  value: string;
  sort: number;
  status: number;
  remark?: string;
}

// 字典类型API
export const getAllDictTypeApi = () =>
  ApiClient.get<DictTypeResult[]>('/v1/sys/dict-types/all');

export const getDictTypeListApi = (params: DictTypeParams) =>
  ApiClient.get('/v1/sys/dict-types', { params });

export const createDictTypeApi = (data: CreateDictTypeParams) =>
  ApiClient.post('/v1/sys/dict-types', data);

export const updateDictTypeApi = (pk: number, data: CreateDictTypeParams) =>
  ApiClient.put(`/v1/sys/dict-types/${pk}`, data);

export const deleteDictTypeApi = (pks: number[]) =>
  ApiClient.delete('/v1/sys/dict-types', { data: { pks } });

// 字典数据API
export const getDictDataDetailApi = (code: string) =>
  ApiClient.get<DictDataResult[]>(`/v1/sys/dict-datas/type-codes/${code}`);

export const getDictDataListApi = (params: DictDataParams) =>
  ApiClient.get('/v1/sys/dict-datas', { params });

export const createDictDataApi = (data: CreateDictDataParams) =>
  ApiClient.post('/v1/sys/dict-datas', data);

export const updateDictDataApi = (pk: number, data: CreateDictDataParams) =>
  ApiClient.put(`/v1/sys/dict-datas/${pk}`, data);

export const deleteDictDataApi = (pks: number[]) =>
  ApiClient.delete('/v1/sys/dict-datas', { data: { pks } });
