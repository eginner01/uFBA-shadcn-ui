import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Cpu, MemoryStick, HardDrive, Server } from "lucide-react";
import { getServerMonitorApi } from '@/api/monitor';

interface ServerMonitorData {
  cpu?: {
    usage: number;
    logical_num: number;
    physical_num: number;
    current_freq: number;
  };
  mem?: {
    total: string;
    used: string;
    free: string;
    usage: number;
  };
  sys?: Record<string, string>;
  disk?: Array<{
    dir: string;
    type: string;
    total: string;
    free: string;
    used: string;
    usage: number;
  }>;
}

export default function ServerMonitorPage() {
  const [data, setData] = useState<ServerMonitorData>({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await getServerMonitorApi();
      console.log('服务器监控数据:', response);
      setData(response);
    } catch (error) {
      console.error('获取服务器监控数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 每30秒刷新一次
    return () => clearInterval(interval); // 清理定时器
  }, []);

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'bg-emerald-500';
    if (usage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6 min-h-[calc(100vh-200px)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">服务器监控</h1>
          <p className="text-muted-foreground text-sm mt-1">实时监控服务器运行状态</p>
        </div>
        <Button variant="outline" onClick={fetchData} className="border-border hover:bg-accent text-sm" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* CPU信息 */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base">
              <Cpu className="w-5 h-5 text-blue-500" />
              CPU 信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground text-sm">使用率</span>
                <span className={`font-bold ${data.cpu && data.cpu.usage > 80 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {data.cpu?.usage?.toFixed(1) || 0}%
                </span>
              </div>
              <Progress value={data.cpu?.usage || 0} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground text-sm">物理核心：</span>
                <span className="text-foreground ml-2 text-sm">{data.cpu?.physical_num || 0}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">逻辑核心：</span>
                <span className="text-foreground ml-2 text-sm">{data.cpu?.logical_num || 0}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground text-sm">当前频率：</span>
                <span className="text-foreground ml-2 text-sm">{data.cpu?.current_freq?.toFixed(2) || 0} MHz</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 内存信息 */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base">
              <MemoryStick className="w-5 h-5 text-green-500" />
              内存信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground text-sm">使用率</span>
                <span className={`font-bold ${data.mem && data.mem.usage > 80 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {data.mem?.usage?.toFixed(1) || 0}%
                </span>
              </div>
              <Progress value={data.mem?.usage || 0} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground text-sm">总内存：</span>
                <span className="text-foreground ml-2 text-sm">{data.mem?.total || '0 GB'}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">已使用：</span>
                <span className="text-foreground ml-2 text-sm">{data.mem?.used || '0 GB'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground text-sm">剩余：</span>
                <span className="text-foreground ml-2 text-sm">{data.mem?.free || '0 GB'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 系统信息 */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base">
              <Server className="w-5 h-5 text-purple-500" />
              系统信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {data.sys && Object.entries(data.sys).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground text-sm">{key}：</span>
                  <span className="text-foreground text-sm">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 磁盘信息 */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base">
              <HardDrive className="w-5 h-5 text-orange-500" />
              磁盘信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.disk && data.disk.length > 0 ? (
                data.disk.map((disk, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground text-sm">{disk.dir}</span>
                      <span className={`font-medium ${Number(disk.usage) > 80 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {typeof disk.usage === 'number' ? disk.usage.toFixed(1) : Number(disk.usage || 0).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={Number(disk.usage) || 0} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {disk.used} / {disk.total}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-center py-4 text-sm">暂无磁盘信息</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
