import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, Activity } from "lucide-react";
import { getRedisMonitorApi } from '@/api/monitor';

export default function RedisMonitorPage() {
  const [redisInfo, setRedisInfo] = useState<Record<string, any>>({});
  const [redisStats, setRedisStats] = useState<Array<{name: string; value: string}>>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getRedisMonitorApi();
      // 后端返回 { info: {...}, stats: [...] }
      setRedisInfo(response?.info || {});
      setRedisStats(response?.stats || []);
    } catch (error) {
      console.error('获取Redis监控数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 min-h-[calc(100vh-200px)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Redis监控</h1>
          <p className="text-muted-foreground text-sm mt-1">实时监控Redis运行状态</p>
        </div>
        <Button variant="outline" onClick={fetchData} className="border-border hover:bg-accent text-sm" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base">
              <Database className="w-5 h-5 text-red-500" />
              基本信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">版本：</span>
              <span className="text-foreground text-sm">{redisInfo.redis_version || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">运行模式：</span>
              <span className="text-foreground text-sm">{redisInfo.redis_mode || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">端口：</span>
              <span className="text-foreground text-sm">{redisInfo.tcp_port || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">运行天数：</span>
              <span className="text-foreground text-sm">{redisInfo.uptime_in_days || 0} 天</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base">
              <Activity className="w-5 h-5 text-green-500" />
              性能指标
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">连接的客户端：</span>
              <span className="text-foreground text-sm">{redisInfo.connected_clients || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">使用内存：</span>
              <span className="text-foreground text-sm">{redisInfo.used_memory_human || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">峰值内存：</span>
              <span className="text-foreground text-sm">{redisInfo.used_memory_peak_human || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">内存碎片率：</span>
              <span className="text-foreground text-sm">{redisInfo.mem_fragmentation_ratio || '-'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base">
              <Database className="w-5 h-5 text-blue-500" />
              统计信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">总连接数：</span>
              <span className="text-foreground text-sm">{redisInfo.total_connections_received || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">执行命令数：</span>
              <span className="text-foreground text-sm">{redisInfo.total_commands_processed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">键总数：</span>
              <span className="text-foreground text-sm">{redisInfo.keys_num || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">过期键数：</span>
              <span className="text-foreground text-sm">{redisInfo.expired_keys || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground text-base">命令统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {redisStats.map((stat) => (
              <div key={stat.name} className="space-y-1">
                <div className="text-muted-foreground text-xs">{stat.name}</div>
                <div className="text-foreground font-medium text-sm">{stat.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
