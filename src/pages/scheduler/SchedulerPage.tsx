import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Plus, Search, Edit, Trash2, Play, Square } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { ApiClient } from '@/api/client';

interface TaskScheduler {
  id: number;
  name: string;
  job_class: string;
  cron: string;
  enabled: boolean;
  args?: string;
  kwargs?: string;
  total_run_count: number;
  last_run_time?: string;
  created_time: string;
  remark?: string;
}

export default function SchedulerPage() {
  const { toast } = useToast();
  const { confirm } = useConfirmDialog();
  const [tasks, setTasks] = useState<TaskScheduler[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<TaskScheduler>>({});
  const [searchParams, setSearchParams] = useState({
    name: '',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get('/v1/tasks/schedulers', {
        params: {
          page: pagination.current,
          size: pagination.pageSize,
          name: searchParams.name,
        },
      });
      // response 本身就是数据对象（拦截器已处理）
      const data = response?.items || response?.data || [];
      const total = response?.total || response?.count || 0;
      setTasks(data);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      toast({
        title: "错误",
        description: "获取任务列表失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [pagination.current]);

  const handleAdd = () => {
    setCurrentTask({ enabled: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (task: TaskScheduler) => {
    setCurrentTask(task);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: '删除任务',
      description: '确认删除该定时任务？',
      confirmText: '删除',
      type: 'warning',
    });
    if (!confirmed) return;
    try {
      await ApiClient.delete(`/v1/tasks/schedulers/${id}`);
      toast({ title: "成功", description: "删除任务成功" });
      fetchTasks();
    } catch (error) {
      toast({
        title: "错误",
        description: "删除任务失败",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await ApiClient.put(`/v1/tasks/schedulers/${id}/status`);
      toast({ title: "成功", description: "状态更新成功" });
      fetchTasks();
    } catch (error) {
      toast({
        title: "错误",
        description: "状态更新失败",
        variant: "destructive",
      });
    }
  };

  const handleExecute = async (id: number) => {
    try {
      await ApiClient.post(`/v1/tasks/schedulers/${id}/executions`);
      toast({ title: "成功", description: "任务已提交执行" });
    } catch (error) {
      toast({
        title: "错误",
        description: "执行任务失败",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      if (currentTask.id) {
        await ApiClient.put(`/v1/tasks/schedulers/${currentTask.id}`, currentTask);
        toast({ title: "成功", description: "更新任务成功" });
      } else {
        await ApiClient.post('/v1/tasks/schedulers', currentTask);
        toast({ title: "成功", description: "新增任务成功" });
      }
      setIsDialogOpen(false);
      fetchTasks();
    } catch (error) {
      toast({
        title: "错误",
        description: "保存任务失败",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">任务管理</h1>
          <p className="text-muted-foreground text-sm mt-1">系统定时任务调度管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTasks} className="border-border hover:bg-accent text-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            新增任务
          </Button>
        </div>
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
            <Button onClick={() => { setPagination(prev => ({ ...prev, current: 1 })); fetchTasks(); }} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
              <Search className="w-4 h-4 mr-2" />
              查询
            </Button>
            <Button variant="outline" onClick={() => { setSearchParams({ name: '' }); setPagination(prev => ({ ...prev, current: 1 })); setTimeout(fetchTasks, 0); }} className="border-border hover:bg-accent text-sm">
              重置
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted border-border">
                  <TableHead className="text-muted-foreground font-medium text-xs">ID</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs">任务名称</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs">任务类</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs">Cron表达式</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs">执行次数</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs">最后执行</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-xs">状态</TableHead>
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
                ) : tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TableRow key={task.id} className="border-border hover:bg-accent/50">
                      <TableCell className="text-foreground text-sm">{task.id}</TableCell>
                      <TableCell className="font-medium text-foreground text-sm">{task.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{task.job_class}</TableCell>
                      <TableCell className="text-muted-foreground text-sm font-mono">{task.cron}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{task.total_run_count}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{task.last_run_time?.split('.')[0] || '-'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={task.enabled ? "default" : "secondary"}
                          className={task.enabled ? "bg-green-500/10 text-green-500 border-green-500/20 text-xs" : "bg-muted text-muted-foreground border-border text-xs"}
                        >
                          {task.enabled ? '启用' : '禁用'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExecute(task.id)}
                            className="text-muted-foreground hover:text-green-500 hover:bg-green-500/10 h-7 w-7 p-0"
                            title="立即执行"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(task.id)}
                            className="text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10 h-7 w-7 p-0"
                            title={task.enabled ? '禁用' : '启用'}
                          >
                            <Square className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(task)}
                            className="text-muted-foreground hover:text-foreground hover:bg-accent h-7 w-7 p-0"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(task.id)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {currentTask.id ? '编辑任务' : '新增任务'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div>
              <Label className="text-muted-foreground text-sm">任务名称 *</Label>
              <Input
                value={currentTask.name || ''}
                onChange={(e) => setCurrentTask(prev => ({ ...prev, name: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入任务名称"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">任务类 *</Label>
              <Input
                value={currentTask.job_class || ''}
                onChange={(e) => setCurrentTask(prev => ({ ...prev, job_class: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="例如: tasks.example_task"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Cron表达式 *</Label>
              <Input
                value={currentTask.cron || ''}
                onChange={(e) => setCurrentTask(prev => ({ ...prev, cron: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm font-mono"
                placeholder="例如: 0 0 * * * (每天凌晨00:00)"
              />
              <p className="text-xs text-muted-foreground mt-1">格式: 秒 分 时 日 月 周</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">参数 (JSON)</Label>
              <Input
                value={currentTask.args || ''}
                onChange={(e) => setCurrentTask(prev => ({ ...prev, args: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm font-mono"
                placeholder='["arg1", "arg2"]'
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">关键字参数 (JSON)</Label>
              <Input
                value={currentTask.kwargs || ''}
                onChange={(e) => setCurrentTask(prev => ({ ...prev, kwargs: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm font-mono"
                placeholder='{"key": "value"}'
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">备注</Label>
              <Input
                value={currentTask.remark || ''}
                onChange={(e) => setCurrentTask(prev => ({ ...prev, remark: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入备注"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border text-sm">
              取消
            </Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
