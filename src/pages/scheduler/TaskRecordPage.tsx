import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Search, Eye, Trash2, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { ApiClient } from '@/api/client';

interface TaskResult {
  id: number;
  task_id: string;
  name: string;
  status: string;
  result?: string;
  args?: string;
  kwargs?: string;
  worker?: string;
  retries?: number;
  date_done?: string;
  traceback?: string;
  runtime?: number;
}

export default function TaskRecordPage() {
  const { toast } = useToast();
  const { confirm } = useConfirmDialog();
  const [records, setRecords] = useState<TaskResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<TaskResult | null>(null);
  const [searchParams, setSearchParams] = useState({
    name: '',
    task_id: '',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get('/v1/tasks/results', {
        params: {
          page: pagination.current,
          size: pagination.pageSize,
          name: searchParams.name,
          task_id: searchParams.task_id,
        },
      });
      // response 本身就是数据对象（拦截器已处理）
      const data = response?.items || response?.data || [];
      const total = response?.total || response?.count || 0;
      setRecords(data);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      toast({
        title: "错误",
        description: "获取执行记录失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [pagination.current]);

  const handleViewDetail = (record: TaskResult) => {
    setCurrentRecord(record);
    setIsDetailOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: '删除记录',
      description: '确认删除该执行记录？',
      confirmText: '删除',
      type: 'warning',
    });
    if (!confirmed) return;
    try {
      await ApiClient.delete(`/v1/tasks/results/${id}`);
      toast({ title: "成功", description: "删除记录成功" });
      fetchRecords();
    } catch (error) {
      toast({
        title: "错误",
        description: "删除记录失败",
        variant: "destructive",
      });
    }
  };

  const handleRevoke = async (taskId: string) => {
    const confirmed = await confirm({
      title: '撤销任务',
      description: '确认撤销该正在执行的任务？',
      confirmText: '撤销',
      type: 'warning',
    });
    if (!confirmed) return;
    try {
      await ApiClient.delete(`/v1/tasks/${taskId}/cancel`);
      toast({ title: "成功", description: "任务已撤销" });
      fetchRecords();
    } catch (error) {
      toast({
        title: "错误",
        description: "撤销任务失败",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'SUCCESS': { label: '成功', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
      'FAILURE': { label: '失败', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
      'PENDING': { label: '等待中', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
      'STARTED': { label: '执行中', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
      'RETRY': { label: '重试中', className: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
      'REVOKED': { label: '已撤销', className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
    };
    const config = statusMap[status] || { label: status, className: 'bg-muted text-muted-foreground border-border' };
    return (
      <Badge variant="secondary" className={`${config.className} text-xs`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">执行记录</h1>
          <p className="text-muted-foreground text-sm mt-1">任务执行历史记录查询</p>
        </div>
        <Button variant="outline" onClick={fetchRecords} className="border-border hover:bg-accent text-sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新
        </Button>
      </div>

      <Card className="border-border bg-card min-h-[calc(100vh-200px)]">
        <CardContent className="p-6 h-full">
          <div className="flex items-end gap-4 mb-4">
            <div className="flex-1">
              <Label className="text-muted-foreground mb-2 block text-sm">任务名称</Label>
              <Input
                placeholder="请输入任务名称"
                value={searchParams.name}
                onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
                className="bg-input border-border text-foreground text-sm"
              />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground mb-2 block text-sm">任务ID</Label>
              <Input
                placeholder="请输入任务ID"
                value={searchParams.task_id}
                onChange={(e) => setSearchParams(prev => ({ ...prev, task_id: e.target.value }))}
                className="bg-input border-border text-foreground text-sm font-mono"
              />
            </div>
            <Button onClick={() => { setPagination(prev => ({ ...prev, current: 1 })); fetchRecords(); }} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
              <Search className="w-4 h-4 mr-2" />
              查询
            </Button>
            <Button variant="outline" onClick={() => { setSearchParams({ name: '', task_id: '' }); setPagination(prev => ({ ...prev, current: 1 })); setTimeout(fetchRecords, 0); }} className="border-border hover:bg-accent text-sm">
              重置
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted border-border">
                  <TableHead className="text-muted-foreground font-medium text-xs">ID</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs">任务名称</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs">任务ID</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs">状态</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs">执行节点</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs">重试次数</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs">完成时间</TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium text-xs">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.id} className="border-border hover:bg-accent/50">
                      <TableCell className="text-foreground text-sm">{record.id}</TableCell>
                      <TableCell className="font-medium text-foreground text-sm">{record.name || '-'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm font-mono text-xs">{record.task_id?.substring(0, 16)}...</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{record.worker || '-'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{record.retries || 0}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{record.date_done?.split('.')[0] || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(record)}
                            className="text-muted-foreground hover:text-foreground hover:bg-accent h-7 w-7 p-0"
                            title="查看详情"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          {record.status === 'PENDING' || record.status === 'STARTED' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevoke(record.task_id)}
                              className="text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 h-7 w-7 p-0"
                              title="撤销任务"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </Button>
                          ) : null}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(record.id)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                            title="删除记录"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              共 {pagination.total} 条记录
            </div>
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
              <span className="px-3 py-2 text-foreground text-sm">
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

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-card border-border max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">执行详情</DialogTitle>
          </DialogHeader>
          {currentRecord && (
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">任务名称</Label>
                  <p className="text-foreground text-sm mt-1">{currentRecord.name || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">状态</Label>
                  <div className="mt-1">{getStatusBadge(currentRecord.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">任务ID</Label>
                  <p className="text-foreground text-sm mt-1 font-mono break-all">{currentRecord.task_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">执行节点</Label>
                  <p className="text-foreground text-sm mt-1">{currentRecord.worker || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">重试次数</Label>
                  <p className="text-foreground text-sm mt-1">{currentRecord.retries || 0}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">完成时间</Label>
                  <p className="text-foreground text-sm mt-1">{currentRecord.date_done?.split('.')[0] || '-'}</p>
                </div>
              </div>
              
              {currentRecord.args && (
                <div>
                  <Label className="text-muted-foreground text-xs">参数</Label>
                  <pre className="bg-muted p-3 rounded-lg mt-1 text-xs text-foreground overflow-x-auto font-mono">
                    {currentRecord.args}
                  </pre>
                </div>
              )}
              
              {currentRecord.kwargs && (
                <div>
                  <Label className="text-muted-foreground text-xs">关键字参数</Label>
                  <pre className="bg-muted p-3 rounded-lg mt-1 text-xs text-foreground overflow-x-auto font-mono">
                    {currentRecord.kwargs}
                  </pre>
                </div>
              )}
              
              {currentRecord.result && (
                <div>
                  <Label className="text-muted-foreground text-xs">执行结果</Label>
                  <pre className="bg-muted p-3 rounded-lg mt-1 text-xs text-foreground overflow-x-auto font-mono max-h-40">
                    {currentRecord.result}
                  </pre>
                </div>
              )}
              
              {currentRecord.traceback && (
                <div>
                  <Label className="text-muted-foreground text-xs">错误堆栈</Label>
                  <pre className="bg-destructive/10 p-3 rounded-lg mt-1 text-xs text-destructive overflow-x-auto font-mono max-h-60">
                    {currentRecord.traceback}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
