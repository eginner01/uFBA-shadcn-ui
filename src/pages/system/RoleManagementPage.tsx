import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RefreshCw, Plus, Search, Edit, Trash2 } from "lucide-react";
import { getRoleListApi, createRoleApi, updateRoleApi, deleteRoleApi } from '@/api/role';
import { useToast } from "@/components/ui/use-toast";

interface Role {
  id: number;
  name: string;
  status: number;
  is_filter_scopes: boolean;
  remark: string | null;
  created_time: string;
  updated_time: string | null;
  menus?: any[];
  scopes?: any[];
}

export default function RoleManagementPage() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false);
  const [searchParams, setSearchParams] = useState({ name: '', code: '' });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Partial<Role>>({});

  const fetchRoles = async () => {
    if (fetchingRef.current) {
      console.log('已有请求进行中，跳过本次请求');
      return;
    }
    
    fetchingRef.current = true;
    setLoading(true);
    try {
      const response: any = await getRoleListApi({
        page: pagination.current,
        size: pagination.pageSize,
        ...searchParams,
      });
      
      console.log('角色列表响应:', response);
      
      const roles = response?.items || response?.records || response?.data || [];
      const total = response?.total || response?.count || 0;
      
      setRoles(roles);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      console.error('获取角色列表失败:', error);
      toast({ 
        title: "错误", 
        description: error instanceof Error ? error.message : "获取角色列表失败", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [pagination.current]);

  const handleSave = async () => {
    try {
      if (currentRole.id) {
        await updateRoleApi(currentRole.id, currentRole as any);
        toast({ title: "成功", description: "更新角色成功" });
      } else {
        await createRoleApi(currentRole as any);
        toast({ title: "成功", description: "新增角色成功" });
      }
      setIsDialogOpen(false);
      fetchRoles();
    } catch (error) {
      toast({ title: "错误", description: "保存角色失败", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除该角色？')) return;
    try {
      await deleteRoleApi(id);
      toast({ title: "成功", description: "删除角色成功" });
      fetchRoles();
    } catch (error) {
      toast({ title: "错误", description: "删除角色失败", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">角色管理</h1>
          <p className="text-muted-foreground text-sm mt-1">系统角色权限管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRoles} className="border-border hover:bg-accent text-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button onClick={() => { setCurrentRole({}); setIsDialogOpen(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            新增角色
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card min-h-[calc(100vh-200px)]">
        <CardContent className="p-6 h-full">
          <div className="flex items-end gap-4 mb-4">
            <div className="flex-1">
              <Label className="text-muted-foreground mb-2 block text-sm">角色名称</Label>
              <Input
                placeholder="请输入角色名称"
                value={searchParams.name}
                onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
                className="bg-input border-border text-foreground text-sm"
              />
            </div>
            <Button onClick={fetchRoles} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
              <Search className="w-4 h-4 mr-2" />
              查询
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="text-xs">ID</TableHead>
                  <TableHead className="text-xs">角色名称</TableHead>
                  <TableHead className="text-xs">备注</TableHead>
                  <TableHead className="text-xs w-24">状态</TableHead>
                  <TableHead className="text-xs w-40">创建时间</TableHead>
                  <TableHead className="text-xs w-32 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">加载中...</TableCell>
                  </TableRow>
                ) : roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">暂无数据</TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id} className="border-border">
                      <TableCell className="text-sm">{role.id}</TableCell>
                      <TableCell className="font-medium text-sm">{role.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{role.remark || '暂无'}</TableCell>
                      <TableCell>
                        <Badge variant={role.status === 1 ? "default" : "secondary"} 
                          className={role.status === 1 ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}>
                          {role.status === 1 ? '启用' : '禁用'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{role.created_time}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setCurrentRole(role); setIsDialogOpen(true); }} className="hover:bg-accent">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(role.id)} className="hover:bg-accent text-destructive">
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

          {/* 分页 */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#333333]">
            <div className="text-sm text-gray-400">
              共 {pagination.total} 条记录，当前第 {pagination.current} 页
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                disabled={pagination.current === 1 || loading}
                className="border-[#333333] hover:bg-[#252525] text-gray-400"
              >
                上一页
              </Button>
              <span className="px-3 py-2 text-white">
                {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize) || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize) || loading}
                className="border-[#333333] hover:bg-[#252525] text-gray-400"
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1e1e1e] border-[#333333]">
          <DialogHeader>
            <DialogTitle className="text-white">{currentRole.id ? '编辑角色' : '新增角色'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-400">角色名称</Label>
              <Input
                value={currentRole.name || ''}
                onChange={(e) => setCurrentRole(prev => ({ ...prev, name: e.target.value }))}
                className="bg-[#252525] border-[#333333] text-white mt-2"
              />
            </div>
            <div>
              <Label className="text-gray-400">备注</Label>
              <Input
                value={currentRole.remark || ''}
                onChange={(e) => setCurrentRole(prev => ({ ...prev, remark: e.target.value }))}
                className="bg-[#252525] border-[#333333] text-white mt-2"
                placeholder="请输入备注信息"
              />
            </div>
            <div>
              <Label className="text-gray-400">状态</Label>
              <select
                value={currentRole.status || 1}
                onChange={(e) => setCurrentRole(prev => ({ ...prev, status: Number(e.target.value) }))}
                className="w-full bg-[#252525] border border-[#333333] text-white mt-2 px-3 py-2 rounded-md"
              >
                <option value={1}>启用</option>
                <option value={0}>禁用</option>
              </select>
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
