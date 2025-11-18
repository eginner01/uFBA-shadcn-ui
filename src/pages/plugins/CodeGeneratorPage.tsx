import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Upload, Edit, Trash2, Code } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { 
  getCodeGenBusinessListApi,
  updateCodeGenBusinessApi,
  deleteCodeGenBusinessApi,
  importTableApi,
  type CodeGenBusiness,
  type ImportTableParams
} from '@/api/code-generator';

export default function CodeGeneratorPage() {
  const { toast } = useToast();
  const { confirm } = useConfirmDialog();
  const [businesses, setBusinesses] = useState<CodeGenBusiness[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({ table_name: '' });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // 导入对话框
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importParams, setImportParams] = useState<ImportTableParams>({ 
    app: '', 
    table_schema: 'public', 
    table_name: '' 
  });

  // 编辑对话框
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<Partial<CodeGenBusiness>>({});

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries({
          page: pagination.current,
          size: pagination.pageSize,
          table_name: searchParams.table_name,
        }).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
      );
      
      const response = await getCodeGenBusinessListApi(filteredParams);
      setBusinesses(response?.items || []);
      setPagination(prev => ({ ...prev, total: response?.total || 0 }));
    } catch (error) {
      toast({ title: "错误", description: "获取业务列表失败", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [pagination.current, pagination.pageSize]);

  const handleImport = async () => {
    if (!importParams.app || !importParams.table_schema || !importParams.table_name) {
      toast({ title: "错误", description: "请填写完整信息", variant: "destructive" });
      return;
    }
    try {
      await importTableApi(importParams);
      toast({ title: "成功", description: "导入成功" });
      setImportDialogOpen(false);
      setImportParams({ app: '', table_schema: 'public', table_name: '' });
      fetchBusinesses();
    } catch (error) {
      toast({ title: "错误", description: "导入失败", variant: "destructive" });
    }
  };

  const handleEdit = (business: CodeGenBusiness) => {
    setCurrentBusiness(business);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!currentBusiness.id) return;
    try {
      await updateCodeGenBusinessApi(currentBusiness.id, currentBusiness);
      toast({ title: "成功", description: "更新成功" });
      setEditDialogOpen(false);
      fetchBusinesses();
    } catch (error) {
      toast({ title: "错误", description: "更新失败", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmed = await confirm({
      title: '删除业务',
      description: `确认删除代码生成业务「${name}」？`,
      confirmText: '删除',
      type: 'error',
    });
    if (!confirmed) return;
    try {
      await deleteCodeGenBusinessApi(id);
      toast({ title: "成功", description: "删除成功" });
      fetchBusinesses();
    } catch (error) {
      toast({ title: "错误", description: "删除失败", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">代码生成</h1>
          <p className="text-muted-foreground text-sm mt-1">数据库表代码生成管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBusinesses} className="border-border hover:bg-accent text-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button onClick={() => setImportDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
            <Upload className="w-4 h-4 mr-2" />
            导入表
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card min-h-[calc(100vh-200px)]">
        <CardContent className="p-6 h-full">
          <div className="flex items-end gap-4 mb-4">
            <div className="flex-1">
              <Label className="text-muted-foreground mb-2 block text-sm">表名称</Label>
              <Input
                placeholder="请输入表名称"
                value={searchParams.table_name}
                onChange={(e) => setSearchParams({ table_name: e.target.value })}
                className="bg-input border-border text-foreground text-sm"
              />
            </div>
            <Button onClick={fetchBusinesses} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
              查询
            </Button>
            <Button 
              variant="outline" 
              onClick={() => { setSearchParams({ table_name: '' }); setTimeout(fetchBusinesses, 0); }} 
              className="border-border hover:bg-accent text-sm"
            >
              重置
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="text-xs">应用名称</TableHead>
                  <TableHead className="text-xs">表名称</TableHead>
                  <TableHead className="text-xs">表描述</TableHead>
                  <TableHead className="text-xs">实体类名</TableHead>
                  <TableHead className="text-xs">默认时间列</TableHead>
                  <TableHead className="text-xs w-40 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : businesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  businesses.map((business) => (
                    <TableRow key={business.id} className="border-border hover:bg-accent/50">
                      <TableCell className="text-sm text-foreground">{business.app_name}</TableCell>
                      <TableCell className="text-sm text-foreground">{business.table_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{business.table_comment || '-'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{business.class_name || '-'}</TableCell>
                      <TableCell className="text-sm">
                        {business.default_datetime_column ? (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">是</Badge>
                        ) : (
                          <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">否</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(business)}
                            className="text-muted-foreground hover:text-foreground hover:bg-accent h-7 w-7 p-0"
                            title="编辑"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast({ title: "提示", description: "代码生成功能开发中" })}
                            className="text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 h-7 w-7 p-0"
                            title="生成代码"
                          >
                            <Code className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(business.id, business.table_name)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                            title="删除"
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
            <div className="text-sm text-muted-foreground">共 {pagination.total} 条记录</div>
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

      {/* 导入表对话框 */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">导入数据库表</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-muted-foreground text-sm">应用名称 <span className="text-destructive">*</span></Label>
              <Input
                value={importParams.app}
                onChange={(e) => setImportParams(prev => ({ ...prev, app: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入应用名称，如：admin"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">数据库Schema <span className="text-destructive">*</span></Label>
              <Input
                value={importParams.table_schema}
                onChange={(e) => setImportParams(prev => ({ ...prev, table_schema: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入数据库Schema，如：public"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">表名称 <span className="text-destructive">*</span></Label>
              <Input
                value={importParams.table_name}
                onChange={(e) => setImportParams(prev => ({ ...prev, table_name: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入表名称"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)} className="border-border text-sm">取消</Button>
            <Button onClick={handleImport} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">导入</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">编辑代码生成配置</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-sm">应用名称</Label>
                <Input
                  value={currentBusiness.app_name || ''}
                  onChange={(e) => setCurrentBusiness(prev => ({ ...prev, app_name: e.target.value }))}
                  className="bg-input border-border text-foreground mt-2 text-sm"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">实体类名</Label>
                <Input
                  value={currentBusiness.class_name || ''}
                  onChange={(e) => setCurrentBusiness(prev => ({ ...prev, class_name: e.target.value }))}
                  className="bg-input border-border text-foreground mt-2 text-sm"
                />
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">文档描述</Label>
              <Input
                value={currentBusiness.doc_comment || ''}
                onChange={(e) => setCurrentBusiness(prev => ({ ...prev, doc_comment: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">API版本</Label>
              <Input
                value={currentBusiness.api_version || ''}
                onChange={(e) => setCurrentBusiness(prev => ({ ...prev, api_version: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="如：v1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="border-border text-sm">取消</Button>
            <Button onClick={handleSaveEdit} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
