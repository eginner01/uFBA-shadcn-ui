import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { 
  getNoticeListApi, 
  createNoticeApi, 
  updateNoticeApi, 
  deleteNoticeApi,
  type Notice,
  type CreateNoticeParams 
} from '@/api/notice';

export default function NoticePage() {
  const { toast } = useToast();
  const { confirm } = useConfirmDialog();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<Partial<Notice>>({});
  const [previewNotice, setPreviewNotice] = useState<Notice | null>(null);
  const [searchParams, setSearchParams] = useState<{
    title: string;
    type?: number;
    status?: number;
  }>({
    title: '',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      // 过滤空参数
      const filteredParams = Object.fromEntries(
        Object.entries({
          page: pagination.current,
          size: pagination.pageSize,
          title: searchParams.title,
          type: searchParams.type,
          status: searchParams.status,
        }).filter(([_, value]) => 
          value !== '' && value !== undefined && value !== null
        )
      );
      
      const response = await getNoticeListApi(filteredParams);
      setNotices(response?.items || []);
      setPagination(prev => ({ ...prev, total: response?.total || 0 }));
    } catch (error) {
      toast({
        title: "错误",
        description: "获取通知列表失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [pagination.current, pagination.pageSize]);

  const handleAdd = () => {
    setCurrentNotice({ type: 0, status: 1 });
    setIsDialogOpen(true);
  };

  const handleEdit = (notice: Notice) => {
    setCurrentNotice(notice);
    setIsDialogOpen(true);
  };

  const handlePreview = (notice: Notice) => {
    setPreviewNotice(notice);
    setIsPreviewOpen(true);
  };

  const handleDelete = async (id: number, title: string) => {
    const confirmed = await confirm({
      title: '删除通知',
      description: `确认删除通知「${title}」？`,
      confirmText: '删除',
      type: 'error',
    });
    if (!confirmed) return;

    try {
      await deleteNoticeApi([id]);
      toast({ title: "成功", description: "删除成功" });
      fetchNotices();
    } catch (error) {
      toast({
        title: "错误",
        description: "删除失败",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    // 验证
    if (!currentNotice.title?.trim()) {
      toast({ title: "错误", description: "请输入标题", variant: "destructive" });
      return;
    }
    if (!currentNotice.content?.trim()) {
      toast({ title: "错误", description: "请输入内容", variant: "destructive" });
      return;
    }

    try {
      const data: CreateNoticeParams = {
        title: currentNotice.title!,
        type: currentNotice.type ?? 0,
        status: currentNotice.status ?? 1,
        content: currentNotice.content!,
      };

      if (currentNotice.id) {
        await updateNoticeApi(currentNotice.id, data);
        toast({ title: "成功", description: "更新成功" });
      } else {
        await createNoticeApi(data);
        toast({ title: "成功", description: "创建成功" });
      }
      setIsDialogOpen(false);
      fetchNotices();
    } catch (error) {
      toast({
        title: "错误",
        description: "保存失败",
        variant: "destructive",
      });
    }
  };

  const getTypeBadge = (type: number) => {
    return type === 0 
      ? <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">通知</Badge>
      : <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">公告</Badge>;
  };

  const getStatusBadge = (status: number) => {
    return status === 1
      ? <Badge className="bg-green-500/10 text-green-500 border-green-500/20">已启用</Badge>
      : <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">已停用</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">通知公告</h1>
          <p className="text-muted-foreground text-sm mt-1">系统通知公告管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchNotices} className="border-border hover:bg-accent text-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            新增通知
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card min-h-[calc(100vh-200px)]">
        <CardContent className="p-6 h-full">
          <div className="flex items-end gap-4 mb-4">
            <div className="flex-1">
              <Label className="text-muted-foreground mb-2 block text-sm">标题</Label>
              <Input
                placeholder="请输入标题"
                value={searchParams.title}
                onChange={(e) => setSearchParams(prev => ({ ...prev, title: e.target.value }))}
                className="bg-input border-border text-foreground text-sm"
              />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground mb-2 block text-sm">类型</Label>
              <Select 
                value={searchParams.type?.toString() || 'all'} 
                onValueChange={(value) => setSearchParams(prev => ({ 
                  ...prev, 
                  type: value === 'all' ? undefined : Number(value)
                }))}
              >
                <SelectTrigger className="bg-input border-border text-foreground text-sm">
                  <SelectValue placeholder="全部" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="0">通知</SelectItem>
                  <SelectItem value="1">公告</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground mb-2 block text-sm">状态</Label>
              <Select 
                value={searchParams.status?.toString() || 'all'} 
                onValueChange={(value) => setSearchParams(prev => ({ 
                  ...prev, 
                  status: value === 'all' ? undefined : Number(value)
                }))}
              >
                <SelectTrigger className="bg-input border-border text-foreground text-sm">
                  <SelectValue placeholder="全部" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="1">已启用</SelectItem>
                  <SelectItem value="0">已停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={fetchNotices} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
              查询
            </Button>
            <Button 
              variant="outline" 
              onClick={() => { 
                setSearchParams({ title: '' }); 
                setTimeout(fetchNotices, 0); 
              }} 
              className="border-border hover:bg-accent text-sm"
            >
              重置
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="text-xs">标题</TableHead>
                  <TableHead className="text-xs w-24">类型</TableHead>
                  <TableHead className="text-xs w-24">状态</TableHead>
                  <TableHead className="text-xs w-40">创建时间</TableHead>
                  <TableHead className="text-xs w-32 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : notices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  notices.map((notice) => (
                    <TableRow key={notice.id} className="border-border hover:bg-accent/50">
                      <TableCell className="text-sm text-foreground">{notice.title}</TableCell>
                      <TableCell className="text-sm">{getTypeBadge(notice.type)}</TableCell>
                      <TableCell className="text-sm">{getStatusBadge(notice.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {notice.created_time?.split(' ')[0] || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(notice)}
                            className="text-muted-foreground hover:text-foreground hover:bg-accent h-7 w-7 p-0"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(notice)}
                            className="text-muted-foreground hover:text-foreground hover:bg-accent h-7 w-7 p-0"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notice.id, notice.title)}
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

          {/* 分页 */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              共 {pagination.total} 条记录
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, current: Math.max(1, prev.current - 1) }))}
                disabled={pagination.current === 1}
                className="border-border text-sm"
              >
                上一页
              </Button>
              <span className="text-sm text-muted-foreground flex items-center px-2">
                {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize) || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                className="border-border text-sm"
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 新增/编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {currentNotice.id ? '编辑通知' : '新增通知'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-muted-foreground text-sm">标题 <span className="text-destructive">*</span></Label>
              <Input
                value={currentNotice.title || ''}
                onChange={(e) => setCurrentNotice(prev => ({ ...prev, title: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入标题"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-sm">类型 <span className="text-destructive">*</span></Label>
                <RadioGroup 
                  value={currentNotice.type?.toString() || '0'}
                  onValueChange={(value: string) => setCurrentNotice(prev => ({ 
                    ...prev, 
                    type: Number(value)
                  }))}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="type-0" />
                    <Label htmlFor="type-0" className="cursor-pointer font-normal text-sm">通知</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="type-1" />
                    <Label htmlFor="type-1" className="cursor-pointer font-normal text-sm">公告</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">状态 <span className="text-destructive">*</span></Label>
                <RadioGroup 
                  value={currentNotice.status?.toString() || '1'}
                  onValueChange={(value: string) => setCurrentNotice(prev => ({ 
                    ...prev, 
                    status: Number(value)
                  }))}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="status-1" />
                    <Label htmlFor="status-1" className="cursor-pointer font-normal text-sm">启用</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="status-0" />
                    <Label htmlFor="status-0" className="cursor-pointer font-normal text-sm">停用</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">内容 <span className="text-destructive">*</span></Label>
              <Textarea
                value={currentNotice.content || ''}
                onChange={(e) => setCurrentNotice(prev => ({ ...prev, content: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm min-h-[200px]"
                placeholder="请输入内容（支持 Markdown 格式）"
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

      {/* 预览对话框 */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="bg-card border-border max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">{previewNotice?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex gap-2 mb-4">
              {previewNotice && getTypeBadge(previewNotice.type)}
              {previewNotice && getStatusBadge(previewNotice.status)}
              <span className="text-sm text-muted-foreground ml-auto">
                {previewNotice?.created_time}
              </span>
            </div>
            <div className="prose prose-sm max-w-none text-foreground">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {previewNotice?.content}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
