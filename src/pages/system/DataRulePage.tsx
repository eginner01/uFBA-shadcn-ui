import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RefreshCw, Plus, Search, Edit, Trash2 } from "lucide-react";
import { getUserListApi, createUserApi, updateUserApi, deleteUserApi } from '@/api/user';
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: number;
  uuid: string;
  username: string;
  nickname: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  status: number;
  dept_id: number;
  is_superuser: boolean;
  is_staff: boolean;
  is_multi_login: boolean;
  join_time: string;
  last_login_time: string;
  dept?: {
    id: number;
    name: string;
    status: number;
  };
  roles?: Array<{
    id: number;
    name: string;
    status: number;
  }>;
}

export default function DataRulePage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    username: '',
    phone: '',
    status: '',
  });
  const fetchingRef = useRef(false); // 防止重复请求
  
  // 分页
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 对话框状态
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});

  // 获取用户列表
  const fetchUsers = async () => {
    // 防止重复请求
    if (fetchingRef.current) {
      console.log('已有请求进行中，跳过本次请求');
      return;
    }
    
    fetchingRef.current = true;
    setLoading(true);
    try {
      const response: any = await getUserListApi({
        page: pagination.current,
        size: pagination.pageSize,
        username: searchParams.username,
        phone: searchParams.phone,
        status: searchParams.status ? Number(searchParams.status) : undefined,
      });
      
      console.log('用户列表响应:', response);
      
      // 响应拦截器已经提取了data，所以response就是data部分
      // 支持多种响应格式
      const users = response?.items || response?.records || response?.data || [];
      const total = response?.total || response?.count || 0;
      
      console.log('解析后的用户:', users);
      console.log('总数:', total);
      
      setUsers(users);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      console.error('获取用户列表失败:', error);
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "获取用户列表失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.current]);

  // 搜索
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchUsers();
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({ username: '', phone: '', status: '' });
    setPagination(prev => ({ ...prev, current: 1 }));
    setTimeout(fetchUsers, 0);
  };

  // 新增用户
  const handleAdd = () => {
    setCurrentUser({});
    setIsAddDialogOpen(true);
  };

  // 编辑用户
  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  // 删除用户
  const handleDelete = async (id: number) => {
    if (!confirm('确认删除该用户？')) return;
    try {
      await deleteUserApi(id);
      toast({
        title: "成功",
        description: "删除用户成功",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "错误",
        description: "删除用户失败",
        variant: "destructive",
      });
    }
  };

  // 保存用户（新增或编辑）
  const handleSave = async () => {
    try {
      if (currentUser.id) {
        await updateUserApi(currentUser.id, currentUser as any);
        toast({ title: "成功", description: "更新用户成功" });
      } else {
        await createUserApi(currentUser as any);
        toast({ title: "成功", description: "新增用户成功" });
      }
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast({
        title: "错误",
        description: "保存用户失败",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">数据规则</h1>
          <p className="text-muted-foreground mt-2">数据权限规则配置</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchUsers} className="border-[#333333] hover:bg-[#252525]">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button onClick={handleAdd} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            新增用户
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card min-h-[calc(100vh-200px)]">
        <CardContent className="p-6 h-full">
          {/* 搜索栏 */}
          <div className="flex items-end gap-4 mb-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-gray-400 mb-2 block">用户名</Label>
              <Input
                placeholder="请输入用户名"
                value={searchParams.username}
                onChange={(e) => setSearchParams(prev => ({ ...prev, username: e.target.value }))}
                className="bg-[#252525] border-[#333333] text-white"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label className="text-gray-400 mb-2 block">手机号</Label>
              <Input
                placeholder="请输入手机号"
                value={searchParams.phone}
                onChange={(e) => setSearchParams(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-[#252525] border-[#333333] text-white"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label className="text-gray-400 mb-2 block">状态</Label>
              <Select value={searchParams.status} onValueChange={(value) => setSearchParams(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="bg-[#252525] border-[#333333] text-white">
                  <SelectValue placeholder="全部" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">启用</SelectItem>
                  <SelectItem value="0">禁用</SelectItem>
                </SelectContent>
              </Select>
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

          {/* 表格 */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#252525] hover:bg-[#252525] border-[#333333]">
                  <TableHead className="text-white font-semibold">ID</TableHead>
                  <TableHead className="text-white font-semibold">用户名</TableHead>
                  <TableHead className="text-white font-semibold">昵称</TableHead>
                  <TableHead className="text-white font-semibold">手机号</TableHead>
                  <TableHead className="text-white font-semibold">邮箱</TableHead>
                  <TableHead className="text-white font-semibold">状态</TableHead>
                  <TableHead className="text-white font-semibold">创建时间</TableHead>
                  <TableHead className="text-right text-white font-semibold">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="border-[#333333]">
                      <TableCell className="text-white">{user.id}</TableCell>
                      <TableCell className="font-medium text-white">{user.username}</TableCell>
                      <TableCell className="text-gray-400">{user.nickname}</TableCell>
                      <TableCell className="text-gray-400">{user.phone || '暂无'}</TableCell>
                      <TableCell className="text-gray-400">{user.email || '暂无'}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 1 ? "default" : "secondary"} 
                          className={user.status === 1 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "bg-gray-500/20 text-gray-400 border-gray-500/50"}>
                          {user.status === 1 ? '启用' : '禁用'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">{user.join_time}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
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
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-400">
              共 {pagination.total} 条记录
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                disabled={pagination.current === 1}
                className="border-[#333333] hover:bg-[#252525]"
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
                className="border-[#333333] hover:bg-[#252525]"
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 新增/编辑对话框 */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open && isAddDialogOpen);
        setIsEditDialogOpen(open && isEditDialogOpen);
      }}>
        <DialogContent className="bg-[#1e1e1e] border-[#333333]">
          <DialogHeader>
            <DialogTitle className="text-white">
              {currentUser.id ? '编辑用户' : '新增用户'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-400">用户名</Label>
              <Input
                value={currentUser.username || ''}
                onChange={(e) => setCurrentUser(prev => ({ ...prev, username: e.target.value }))}
                className="bg-[#252525] border-[#333333] text-white mt-2"
              />
            </div>
            <div>
              <Label className="text-gray-400">昵称</Label>
              <Input
                value={currentUser.nickname || ''}
                onChange={(e) => setCurrentUser(prev => ({ ...prev, nickname: e.target.value }))}
                className="bg-[#252525] border-[#333333] text-white mt-2"
              />
            </div>
            <div>
              <Label className="text-gray-400">手机号</Label>
              <Input
                value={currentUser.phone || ''}
                onChange={(e) => setCurrentUser(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-[#252525] border-[#333333] text-white mt-2"
              />
            </div>
            <div>
              <Label className="text-gray-400">邮箱</Label>
              <Input
                value={currentUser.email || ''}
                onChange={(e) => setCurrentUser(prev => ({ ...prev, email: e.target.value }))}
                className="bg-[#252525] border-[#333333] text-white mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); setIsEditDialogOpen(false); }} className="border-[#333333]">
              取消
            </Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
