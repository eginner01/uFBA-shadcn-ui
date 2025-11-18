import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RefreshCw, Plus, Search, Edit, Trash2, ChevronRight, ChevronDown, User, Mail, Phone, Building2, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserListApi, createUserApi, updateUserApi, deleteUserApi } from '@/api/user';
import { getDeptTreeApi } from '@/api/dept';
import { useToast } from "@/components/ui/use-toast";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";

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

interface Department {
  id: number;
  name: string;
  parent_id: number | null;
  level: number;
  sort: number;
  status: number;
  children?: Department[];
}

export default function UserManagementPage() {
  const { toast } = useToast();
  const { confirm } = useConfirmDialog();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    username: '',
    phone: '',
    status: '',
    dept: undefined as number | undefined,
  });
  
  // 部门树相关
  const [deptTree, setDeptTree] = useState<Department[]>([]);
  const [deptSearchValue, setDeptSearchValue] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(undefined);
  const [expandedDepts, setExpandedDepts] = useState<Set<number>>(new Set());
  const fetchingRef = useRef(false); // 防止重复请求
  
  // 获取部门树
  const fetchDeptTree = async (name?: string) => {
    try {
      const response: any = await getDeptTreeApi(name ? { name } : undefined);
      const depts = response?.items || response || [];
      setDeptTree(depts);
      // 默认展开所有部门
      const allIds = new Set<number>();
      const collectIds = (depts: Department[]) => {
        depts.forEach(dept => {
          allIds.add(dept.id);
          if (dept.children) collectIds(dept.children);
        });
      };
      collectIds(depts);
      setExpandedDepts(allIds);
    } catch (error) {
      console.error('获取部门树失败:', error);
    }
  };
  
  // 搜索部门
  const handleDeptSearch = () => {
    fetchDeptTree(deptSearchValue || undefined);
  };
  
  // 选择部门
  const handleDeptSelect = (deptId: number) => {
    setSelectedDeptId(deptId);
    setSearchParams(prev => ({ ...prev, dept: deptId }));
  };
  
  // 切换展开/折叠
  const toggleDeptExpand = (deptId: number) => {
    setExpandedDepts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deptId)) {
        newSet.delete(deptId);
      } else {
        newSet.add(deptId);
      }
      return newSet;
    });
  };
  
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
        dept: searchParams.dept,
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
  }, [pagination.current, searchParams.dept]);
  
  useEffect(() => {
    fetchDeptTree();
  }, []);

  // 搜索
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchUsers();
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({ username: '', phone: '', status: '', dept: undefined });
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
    const confirmed = await confirm({
      title: '删除用户',
      description: '确认删除该用户？此操作不可恢复！',
      confirmText: '删除',
      type: 'error',
    });
    if (!confirmed) return;
    
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
  
  // 渲染部门树节点
  const renderDeptTree = (depts: Department[], level = 0): React.ReactNode => {
    return depts.map(dept => (
      <div key={dept.id}>
        <div
          className={`flex items-center py-2 px-2 rounded cursor-pointer hover:bg-accent ${
            selectedDeptId === dept.id ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => handleDeptSelect(dept.id)}
        >
          {dept.children && dept.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleDeptExpand(dept.id);
              }}
              className="mr-1 hover:bg-muted rounded p-0.5"
            >
              {expandedDepts.has(dept.id) ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
          )}
          <span className={`text-sm ${!dept.children || dept.children.length === 0 ? 'ml-5' : ''}`}>
            {deptSearchValue && dept.name.includes(deptSearchValue) ? (
              <>
                {dept.name.substring(0, dept.name.indexOf(deptSearchValue))}
                <span className="text-destructive">{deptSearchValue}</span>
                {dept.name.substring(dept.name.indexOf(deptSearchValue) + deptSearchValue.length)}
              </>
            ) : (
              dept.name
            )}
          </span>
        </div>
        {dept.children && dept.children.length > 0 && expandedDepts.has(dept.id) && (
          <div>{renderDeptTree(dept.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">用户管理</h1>
          <p className="text-muted-foreground text-sm mt-1">系统用户账号管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchUsers} className="border-border hover:bg-accent text-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            新增用户
          </Button>
        </div>
      </div>

      {/* 左右分栏布局 - 精确对齐 */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        {/* 左侧：部门树 */}
        <Card className="col-span-3 border-border bg-card flex flex-col overflow-hidden">
          <CardContent className="p-4">
            <div className="mb-3">
              <div className="flex gap-2">
                <Input
                  placeholder="搜索部门"
                  value={deptSearchValue}
                  onChange={(e) => setDeptSearchValue(e.target.value)}
                  className="bg-input border-border text-foreground text-sm flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleDeptSearch()}
                />
                <Button size="sm" onClick={handleDeptSearch} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="mb-2 text-sm font-medium text-foreground">Xxx集团</div>
            <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
              {deptTree.length > 0 ? (
                renderDeptTree(deptTree)
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">暂无部门</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 右侧：用户列表 */}
        <Card className="col-span-9 border-border bg-card flex flex-col overflow-hidden">
        <CardContent className="p-6 flex flex-col h-full overflow-hidden">
          {/* 搜索栏 */}
          <div className="flex items-end gap-4 mb-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-muted-foreground mb-2 block text-sm">用户名</Label>
              <Input
                placeholder="请输入用户名"
                value={searchParams.username}
                onChange={(e) => setSearchParams(prev => ({ ...prev, username: e.target.value }))}
                className="bg-input border-border text-foreground text-sm"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label className="text-muted-foreground mb-2 block text-sm">手机号</Label>
              <Input
                placeholder="请输入手机号"
                value={searchParams.phone}
                onChange={(e) => setSearchParams(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-input border-border text-foreground text-sm"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label className="text-muted-foreground mb-2 block text-sm">状态</Label>
              <Select value={searchParams.status} onValueChange={(value) => setSearchParams(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="bg-input border-border text-foreground text-sm">
                  <SelectValue placeholder="全部" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">启用</SelectItem>
                  <SelectItem value="0">禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
                <Search className="w-4 h-4 mr-2" />
                查询
              </Button>
              <Button variant="outline" onClick={handleReset} className="border-border hover:bg-accent text-sm">
                重置
              </Button>
            </div>
          </div>

          {/* 表格 - 自适应高度 */}
          <div className="flex-1 overflow-auto border border-border rounded-lg">
            <Table className="relative">
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted border-border">
                  <TableHead className="text-xs">用户信息</TableHead>
                  <TableHead className="text-xs">联系方式</TableHead>
                  <TableHead className="text-xs">部门</TableHead>
                  <TableHead className="text-xs w-24">状态</TableHead>
                  <TableHead className="text-xs w-40">创建时间</TableHead>
                  <TableHead className="text-xs w-32 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="border-border hover:bg-accent/30 transition-colors">
                      {/* 用户信息 */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-border">
                            <AvatarImage src={user.avatar || undefined} alt={user.nickname} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {user.nickname?.charAt(0) || user.username?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground text-sm">{user.nickname}</span>
                              {user.is_superuser && (
                                <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-primary/10 text-primary border-primary/20">
                                  超管
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
                              <User className="w-3 h-3" />
                              <span>{user.username}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      {/* 联系方式 */}
                      <TableCell>
                        <div className="space-y-1">
                          {user.phone && (
                            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          {user.email && (
                            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                              <Mail className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[200px]">{user.email}</span>
                            </div>
                          )}
                          {!user.phone && !user.email && (
                            <span className="text-muted-foreground text-xs">暂无</span>
                          )}
                        </div>
                      </TableCell>
                      {/* 部门 */}
                      <TableCell>
                        {user.dept ? (
                          <div className="flex items-center gap-1.5 text-sm">
                            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-foreground">{user.dept.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">未分配</span>
                        )}
                      </TableCell>
                      {/* 状态 */}
                      <TableCell>
                        <Badge variant={user.status === 1 ? "default" : "secondary"} 
                          className={user.status === 1 ? "bg-green-500/10 text-green-500 border-green-500/20 text-xs" : "bg-muted text-muted-foreground border-border text-xs"}>
                          {user.status === 1 ? '正常' : '禁用'}
                        </Badge>
                      </TableCell>
                      {/* 创建时间 */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{user.join_time?.split(' ')[0]}</span>
                        </div>
                      </TableCell>
                      {/* 操作 */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)} className="hover:bg-accent h-8 w-8 p-0" title="编辑">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)} className="hover:bg-accent text-destructive h-8 w-8 p-0" title="删除">
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

      {/* 新增/编辑对话框 */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open && isAddDialogOpen);
        setIsEditDialogOpen(open && isEditDialogOpen);
      }}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {currentUser.id ? '编辑用户' : '新增用户'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-muted-foreground text-sm">用户名</Label>
              <Input
                value={currentUser.username || ''}
                onChange={(e) => setCurrentUser(prev => ({ ...prev, username: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">昵称</Label>
              <Input
                value={currentUser.nickname || ''}
                onChange={(e) => setCurrentUser(prev => ({ ...prev, nickname: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">手机号</Label>
              <Input
                value={currentUser.phone || ''}
                onChange={(e) => setCurrentUser(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">邮箱</Label>
              <Input
                value={currentUser.email || ''}
                onChange={(e) => setCurrentUser(prev => ({ ...prev, email: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); setIsEditDialogOpen(false); }} className="border-border text-sm">
              取消
            </Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
