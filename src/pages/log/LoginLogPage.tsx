import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search } from "lucide-react";
import { getLoginLogListApi } from '@/api/log';

interface LoginLog {
  id: number;
  username: string;
  ip: string;
  location?: string;
  browser?: string;
  os?: string;
  status: number;
  message?: string;
  login_time: string;
}

export default function LoginLogPage() {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({ username: '', ip: '' });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response: any = await getLoginLogListApi({
        page: pagination.current,
        size: pagination.pageSize,
        ...searchParams,
      });
      setLogs(response.items || response.records || []);
      setPagination(prev => ({ ...prev, total: response.total || 0 }));
    } catch (error) {
      console.error('获取登录日志失败', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.current]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">登录日志</h1>
          <p className="text-muted-foreground text-sm mt-1">系统登录日志查询</p>
        </div>
        <Button variant="outline" onClick={fetchLogs} className="border-border hover:bg-accent text-sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新
        </Button>
      </div>

      <Card className="border-border bg-card min-h-[calc(100vh-200px)]">
        <CardContent className="p-6 h-full">
          <div className="flex items-end gap-4 mb-4">
            <div className="flex-1">
              <Label className="text-muted-foreground mb-2 block text-sm">用户名</Label>
              <Input
                placeholder="请输入用户名"
                value={searchParams.username}
                onChange={(e) => setSearchParams(prev => ({ ...prev, username: e.target.value }))}
                className="bg-input border-border text-foreground text-sm"
              />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground mb-2 block text-sm">IP地址</Label>
              <Input
                placeholder="请输入IP地址"
                value={searchParams.ip}
                onChange={(e) => setSearchParams(prev => ({ ...prev, ip: e.target.value }))}
                className="bg-input border-border text-foreground text-sm"
              />
            </div>
            <Button onClick={fetchLogs} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
              <Search className="w-4 h-4 mr-2" />
              查询
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="text-xs">ID</TableHead>
                  <TableHead className="text-xs">用户名</TableHead>
                  <TableHead className="text-xs">IP地址</TableHead>
                  <TableHead className="text-xs">登录地点</TableHead>
                  <TableHead className="text-xs">浏览器</TableHead>
                  <TableHead className="text-xs w-24">状态</TableHead>
                  <TableHead className="text-xs w-40">登录时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">加载中...</TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">暂无数据</TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} className="border-border">
                      <TableCell className="text-sm">{log.id}</TableCell>
                      <TableCell className="font-medium text-sm">{log.username}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{log.ip}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{log.location || '-'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{log.browser || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === 1 ? "default" : "secondary"} 
                          className={log.status === 1 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>
                          {log.status === 1 ? '成功' : '失败'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{log.login_time}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">共 {pagination.total} 条记录</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                disabled={pagination.current === 1}
                className="border-border hover:bg-accent text-sm"
              >
                上一页
              </Button>
              <span className="px-3 py-2 text-white">
                {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                className="border-border hover:bg-accent text-sm"
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
