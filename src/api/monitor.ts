import { ApiClient } from './client';

export interface RedisInfo {
  redis_version: string;
  uptime_in_days: number;
  connected_clients: number;
  used_memory_human: string;
  used_memory_peak_human: string;
  total_connections_received: number;
  total_commands_processed: number;
  instantaneous_ops_per_sec: number;
  keyspace_hits: number;
  keyspace_misses: number;
  [key: string]: any;
}

export interface OnlineUser {
  id: number;
  session_uuid: string;
  username: string;
  nickname: string;
  login_time: string;
  ip: string;
  location?: string;
  browser?: string;
  os?: string;
}

export async function getRedisMonitorApi() {
  return ApiClient.get('/v1/monitors/redis');
}

export async function getServerMonitorApi() {
  return ApiClient.get('/v1/monitors/server');
}

export async function getOnlineUsersApi() {
  return ApiClient.get('/v1/monitors/sessions');
}

export async function kickOutUserApi(id: number, session_uuid: string) {
  return ApiClient.delete(`/v1/monitors/sessions/${id}`, { 
    params: { session_uuid } 
  });
}
