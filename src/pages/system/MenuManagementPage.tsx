import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RefreshCw, Plus, ChevronRight, ChevronDown, Edit, Trash2, FolderTree } from "lucide-react";
import { Icon } from '@iconify/react';
import { useToast } from "@/components/ui/use-toast";
import { getMenuTreeApi, createMenuApi, updateMenuApi, deleteMenuApi } from '@/api/menu';

interface Menu {
  id: number;
  title: string; // 后端字段是title
  name: string;
  path: string;
  icon?: string;
  parent_id?: number;
  sort: number;
  status: number;
  type: number; // 1: 目录, 2: 菜单, 3: 按钮
  display: number;
  cache: number;
  component?: string;
  perms?: string;
  remark?: string;
  created_time: string;
  children?: Menu[];
}

export default function MenuManagementPage() {
  const { toast } = useToast();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<Partial<Menu>>({});
  const fetchingRef = useRef(false);

  const fetchMenus = async () => {
    if (fetchingRef.current) return;
    
    fetchingRef.current = true;
    setLoading(true);
    try {
      const response: any = await getMenuTreeApi({ status: 1 });
      console.log('菜单树响应:', response);
      
      // 响应拦截器已经提取了data，所以response就是data部分
      const menuList = Array.isArray(response) ? response : response?.data || [];
      
      setMenus(menuList);
      // 默认折叠所有节点
      setExpandedIds(new Set());
    } catch (error) {
      console.error('获取菜单失败:', error);
      toast({ 
        title: "错误", 
        description: error instanceof Error ? error.message : "获取菜单列表失败", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allIds = new Set<number>();
    const collectIds = (items: Menu[]) => {
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          allIds.add(item.id);
          collectIds(item.children);
        }
      });
    };
    collectIds(menus);
    setExpandedIds(allIds);
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const handleAdd = (parentId?: number) => {
    setCurrentMenu({ parent_id: parentId, status: 1, type: 2 });
    setIsDialogOpen(true);
  };

  const handleEdit = (menu: Menu) => {
    setCurrentMenu(menu);
    setIsDialogOpen(true);
  };

  const handleDelete = async (menuId: number) => {
    if (!confirm('确认删除该菜单？')) return;
    try {
      await deleteMenuApi(menuId);
      toast({ title: "成功", description: "删除菜单成功" });
      fetchMenus();
    } catch (error) {
      console.error('删除菜单失败:', error);
      toast({ 
        title: "错误", 
        description: "删除菜单失败", 
        variant: "destructive" 
      });
    }
  };

  const handleSave = async () => {
    try {
      // 验证必填字段
      if (!currentMenu.title || !currentMenu.name) {
        toast({ title: "错误", description: "请填写完整菜单信息", variant: "destructive" });
        return;
      }
      
      const menuData: any = {
        title: currentMenu.title,
        name: currentMenu.name,
        path: currentMenu.path || '',
        parent_id: currentMenu.parent_id,
        sort: currentMenu.sort || 0,
        icon: currentMenu.icon,
        type: currentMenu.type || 2,
        status: currentMenu.status || 1,
        display: currentMenu.display || 1,
        cache: currentMenu.cache || 0,
        component: currentMenu.component,
        perms: currentMenu.perms,
        remark: currentMenu.remark,
      };

      if (currentMenu.id) {
        await updateMenuApi(currentMenu.id, menuData);
        toast({ title: "成功", description: "更新菜单成功" });
      } else {
        await createMenuApi(menuData);
        toast({ title: "成功", description: "新增菜单成功" });
      }
      setIsDialogOpen(false);
      fetchMenus();
    } catch (error) {
      console.error('保存菜单失败:', error);
      toast({ 
        title: "错误", 
        description: "保存菜单失败", 
        variant: "destructive" 
      });
    }
  };

  // 翻译国际化key为中文
  const translateTitle = (title: string): string => {
    // 简单的国际化key映射
    const i18nMap: Record<string, string> = {
      'page.dashboard.title': '工作台',
      'page.dashboard.analytics': '分析页',
      'page.dashboard.workspace': '工作空间',
      'page.menu.system': '系统管理',
      'page.menu.user': '用户管理',
      'page.menu.role': '角色管理',
      'page.menu.menu': '菜单管理',
      'page.menu.dept': '部门管理',
      'page.menu.data_rule': '数据权限',
      'page.menu.scheduler': '任务调度',
      'page.menu.manage': '任务管理',
      'page.menu.record': '执行记录',
      'page.menu.log': '日志管理',
      'page.menu.login': '登录日志',
      'page.menu.opera': '操作日志',
      'page.menu.monitor': '系统监控',
      'page.menu.online': '在线用户',
      'page.menu.server': '服务器监控',
      'page.menu.redis': 'Redis监控',
      'page.menu.profile': '个人中心',
      'code_generator.menu': '代码生成',
    };
    
    return i18nMap[title] || title;
  };

  // 渲染图标
  const renderIcon = (menu: Menu) => {
    if (!menu.icon) {
      return <FolderTree className="w-4 h-4 text-muted-foreground" />;
    }
    
    // 如果是URL（http或https开头）
    if (/^https?:\/\//.test(menu.icon)) {
      return <img src={menu.icon} alt="icon" className="w-4 h-4 object-contain" />;
    }
    
    // 使用 Iconify 渲染图标（如：ant-design:dashboard-outlined）
    return <Icon icon={menu.icon} className="w-4 h-4" />;
  };

  // 递归渲染菜单树
  const renderMenuTree = (items: Menu[], level: number = 0): React.ReactNode => {
    return items.map((menu) => (
      <>
        <TableRow key={menu.id} className="border-border">
          <TableCell className="text-sm">
            <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
              {menu.children && menu.children.length > 0 && (
                <button
                  onClick={() => toggleExpand(menu.id)}
                  className="mr-2 hover:bg-accent rounded p-1 transition-colors"
                >
                  {expandedIds.has(menu.id) ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              )}
              {!menu.children?.length && <span className="w-6 mr-2" />}
              <div className="flex items-center gap-2">
                {renderIcon(menu)}
                <span>{translateTitle(menu.title)}</span>
              </div>
            </div>
          </TableCell>
          <TableCell className="text-muted-foreground text-sm">{menu.path}</TableCell>
          <TableCell className="text-muted-foreground text-sm">{menu.sort}</TableCell>
          <TableCell>
            <Badge variant={menu.type === 1 ? "default" : menu.type === 2 ? "secondary" : "outline"}
              className={menu.type === 1 ? "bg-purple-500/20 text-purple-400" : menu.type === 2 ? "bg-blue-500/20 text-blue-400" : "bg-gray-500/20 text-gray-400"}>
              {menu.type === 1 ? '目录' : menu.type === 2 ? '菜单' : '按钮'}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant={menu.status === 1 ? "default" : "secondary"}
              className={menu.status === 1 ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}>
              {menu.status === 1 ? '启用' : '禁用'}
            </Badge>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleAdd(menu.id)} className="hover:bg-accent" title="新增子菜单">
                <Plus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(menu)} className="hover:bg-accent" title="编辑">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(menu.id)} className="hover:bg-accent text-destructive" title="删除">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {menu.children && menu.children.length > 0 && expandedIds.has(menu.id) && (
          renderMenuTree(menu.children, level + 1)
        )}
      </>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">菜单管理</h1>
          <p className="text-muted-foreground text-sm mt-1">系统菜单权限管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={expandAll} className="border-border hover:bg-accent text-sm">
            <FolderTree className="w-4 h-4 mr-2" />
            展开全部
          </Button>
          <Button variant="outline" onClick={collapseAll} className="border-border hover:bg-accent text-sm">
            <FolderTree className="w-4 h-4 mr-2" />
            折叠全部
          </Button>
          <Button variant="outline" onClick={fetchMenus} className="border-border hover:bg-accent text-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button onClick={() => handleAdd()} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            新增菜单
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card min-h-[calc(100vh-200px)]">
        <CardContent className="p-6 h-full">
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="text-xs">菜单名称</TableHead>
                  <TableHead className="text-xs">路径</TableHead>
                  <TableHead className="text-xs w-24">排序</TableHead>
                  <TableHead className="text-xs w-24">类型</TableHead>
                  <TableHead className="text-xs w-24">状态</TableHead>
                  <TableHead className="text-xs w-32 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">加载中...</TableCell>
                  </TableRow>
                ) : menus.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">暂无数据</TableCell>
                  </TableRow>
                ) : (
                  renderMenuTree(menus)
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{currentMenu.id ? '编辑菜单' : '新增菜单'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-muted-foreground text-sm">路由标识 *</Label>
              <Input
                value={currentMenu.title || ''}
                onChange={(e) => setCurrentMenu(prev => ({ ...prev, title: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="英文路由名，如：Dashboard"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">菜单标题 *</Label>
              <Input
                value={currentMenu.name || ''}
                onChange={(e) => setCurrentMenu(prev => ({ ...prev, name: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="显示的中文标题，如：工作台"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">路径</Label>
              <Input
                value={currentMenu.path || ''}
                onChange={(e) => setCurrentMenu(prev => ({ ...prev, path: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">图标</Label>
              <Input
                value={currentMenu.icon || ''}
                onChange={(e) => setCurrentMenu(prev => ({ ...prev, icon: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">排序</Label>
              <Input
                type="number"
                value={currentMenu.sort || 0}
                onChange={(e) => setCurrentMenu(prev => ({ ...prev, sort: Number(e.target.value) }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border text-sm">取消</Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
