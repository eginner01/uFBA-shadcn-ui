import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RefreshCw, Plus, Edit, Trash2, Search, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getDataScopeListApi,
  createDataScopeApi,
  updateDataScopeApi,
  deleteDataScopeApi,
  type DataScopeResult,
  type DataScopeParams
} from '@/api/data-permission';

export default function DataScopePage() {
  const { toast } = useToast();
  const [scopes, setScopes] = useState<DataScopeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentScope, setCurrentScope] = useState<Partial<DataScopeResult>>({});
  const [searchParams, setSearchParams] = useState<DataScopeParams>({ name: '', status: undefined });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const fetchingRef = useRef(false);

  const fetchScopes = async () => {
    if (fetchingRef.current) return;
    
    fetchingRef.current = true;
    setLoading(true);
    try {
      const response: any = await getDataScopeListApi({
        ...searchParams,
        page: pagination.current,
        size: pagination.pageSize
      });
      console.log('数据范围响应:', response);
      
      const scopeList = response?.items || response?.records || response?.data || (Array.isArray(response) ? response : []);
      const total = response?.total || response?.count || scopeList.length;
      
      setScopes(scopeList);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      console.error('获取数据范围失败:', error);
      toast({ title: "错误", description: "获取数据范围列表失败", variant: "destructive" });
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchScopes();
  }, [pagination.current]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchScopes();
  };

  const handleReset = () => {
    setSearchParams({ name: '', status: undefined });
    setPagination(prev => ({ ...prev, current: 1 }));
    setTimeout(fetchScopes, 0);
  };

  const handleAdd = () => {
    setCurrentScope({ status: 1 });
    setIsDialogOpen(true);
  };

  const handleEdit = (scope: DataScopeResult) => {
    setCurrentScope(scope);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除该数据范围？')) return;
    try {
      await deleteDataScopeApi([id]);
      toast({ title: "成功", description: "删除数据范围成功" });
      fetchScopes();
    } catch (error) {
      console.error('删除数据范围失败:', error);
      toast({ title: "错误", description: "删除数据范围失败", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    if (!currentScope.name) {
      toast({ title: "错误", description: "请输入数据范围名称", variant: "destructive" });
      return;
    }
    
    try {
      const data = { name: currentScope.name, status: currentScope.status || 1 };
      
      if (currentScope.id) {
        await updateDataScopeApi(currentScope.id, data);
        toast({ title: "成功", description: "更新数据范围成功" });
      } else {
        await createDataScopeApi(data);
        toast({ title: "成功", description: "新增数据范围成功" });
      }
      setIsDialogOpen(false);
      fetchScopes();
    } catch (error) {
      console.error('保存数据范围失败:', error);
      toast({ title: "错误", description: "保存数据范围失败", variant: "destructive" });
    }
  };

  const handleConfigRules = (scope: DataScopeResult) => {
    toast({ title: "提示", description: `配置 ${scope.name} 的数据规则（功能开发中）` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">数据范围</h1>
          <p className="text-muted-foreground mt-2">数据权限范围管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchScopes} className="border-[#333333] hover:bg-[#252525]">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button onClick={handleAdd} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            新增
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card min-h-[calc(100vh-200px)]">
        <CardContent className="p-6 h-full">
          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-gray-400 mb-2 block">数据范围名称</Label>
              <Input
                placeholder="请输入数据范围名称"
                value={searchParams.name}
                onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
                className="bg-[#252525] border-[#333333] text-white"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label className="text-gray-400 mb-2 block">状态</Label>
              <select
                value={searchParams.status === undefined ? '' : searchParams.status}
                onChange={(e) => setSearchParams(prev => ({ ...prev, status: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full bg-[#252525] border border-[#333333] text-white px-3 py-2 rounded-md"
              >
                <option value="">全部</option>
                <option value="1">正常</option>
                <option value="0">停用</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600">
                <Search className="w-4 h-4 mr-2" />
                查询
              </Button>
              <Button variant="outline" onClick={handleReset} className="border-[#333333] hover:bg-[#252525]">
                重置
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#252525] hover:bg-[#252525] border-[#333333]">
                  <TableHead className="text-white font-semibold">序号</TableHead>
                  <TableHead className="text-white font-semibold">范围名称</TableHead>
                  <TableHead className="text-white font-semibold">状态</TableHead>
                  <TableHead className="text-white font-semibold">创建时间</TableHead>
                  <TableHead className="text-white font-semibold">更新时间</TableHead>
                  <TableHead className="text-right text-white font-semibold">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">加载中...</TableCell>
                  </TableRow>
                ) : scopes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">暂无数据</TableCell>
                  </TableRow>
                ) : (
                  scopes.map((scope, index) => (
                    <TableRow key={scope.id} className="border-[#333333]">
                      <TableCell className="text-white">{(pagination.current - 1) * pagination.pageSize + index + 1}</TableCell>
                      <TableCell className="font-medium text-white">{scope.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={scope.status === 1 ? "default" : "secondary"}
                          className={scope.status === 1 ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}
                        >
                          {scope.status === 1 ? '正常' : '停用'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">{scope.created_time}</TableCell>
                      <TableCell className="text-gray-400">{scope.updated_time}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleConfigRules(scope)} className="text-purple-400 hover:bg-purple-500/10" title="规则设置">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(scope)} className="text-blue-400 hover:bg-blue-500/10">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(scope.id)} className="text-red-400 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1e1e1e] border-[#333333]">
          <DialogHeader>
            <DialogTitle className="text-white">{currentScope.id ? '编辑数据范围' : '新增数据范围'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-400">数据范围名称 *</Label>
              <Input
                value={currentScope.name || ''}
                onChange={(e) => setCurrentScope(prev => ({ ...prev, name: e.target.value }))}
                className="bg-[#252525] border-[#333333] text-white mt-2"
                placeholder="请输入数据范围名称"
              />
            </div>
            <div>
              <Label className="text-gray-400">状态</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={currentScope.status === 1}
                    onChange={() => setCurrentScope(prev => ({ ...prev, status: 1 }))}
                    className="mr-2"
                  />
                  <span className="text-white">正常</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={currentScope.status === 0}
                    onChange={() => setCurrentScope(prev => ({ ...prev, status: 0 }))}
                    className="mr-2"
                  />
                  <span className="text-white">停用</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-[#333333]">取消</Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
