import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RefreshCw, Plus, Edit, Trash2, ChevronRight, ChevronDown, Building2, ChevronsDown, ChevronsUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { ApiClient } from '@/api/client';

interface Dept {
  id: number;
  name: string;
  parent_id: number | null;
  sort: number;
  leader?: string;
  phone?: string;
  email?: string;
  status: number;
  created_time: string;
  children?: Dept[];
}

export default function DeptManagementPage() {
  const { toast } = useToast();
  const { confirm } = useConfirmDialog();
  const [depts, setDepts] = useState<Dept[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Set<number>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState<Partial<Dept>>({});
  const [searchParams, setSearchParams] = useState<{
    name: string;
    leader: string;
    phone: string;
    status?: number;  // 可选的数字类型
  }>({
    name: '',
    leader: '',
    phone: '',
    // status 不设置，默认为 undefined
  });

  const fetchDepts = async () => {
    setLoading(true);
    try {
      // 过滤掉空字符串和 undefined，只发送有值的参数
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => 
          value !== '' && value !== undefined && value !== null
        )
      );
      
      const response = await ApiClient.get('/v1/sys/depts', {
        params: filteredParams,
      });
      // response 本身就是数据数组（拦截器已处理）
      setDepts(response || []);
      // 默认展开第一层
      const firstLevelIds = (response || []).map((d: Dept) => d.id);
      setExpandedKeys(new Set(firstLevelIds));
    } catch (error) {
      toast({
        title: "错误",
        description: "获取部门列表失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleToggle = (id: number) => {
    setExpandedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAdd = (parentId?: number) => {
    setCurrentDept({ parent_id: parentId || null, status: 1, sort: 0 });
    setIsDialogOpen(true);
  };

  // 展开全部
  const expandAll = () => {
    const allIds = getAllDeptIds(depts);
    setExpandedKeys(new Set(allIds));
  };

  // 折叠全部
  const collapseAll = () => {
    setExpandedKeys(new Set());
  };

  // 获取所有部门ID
  const getAllDeptIds = (depts: Dept[]): number[] => {
    const ids: number[] = [];
    const traverse = (list: Dept[]) => {
      list.forEach(dept => {
        ids.push(dept.id);
        if (dept.children && dept.children.length > 0) {
          traverse(dept.children);
        }
      });
    };
    traverse(depts);
    return ids;
  };

  const handleEdit = (dept: Dept) => {
    setCurrentDept(dept);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: '删除部门',
      description: '确认删除该部门？如有子部门将一并删除！',
      confirmText: '删除',
      type: 'error',
    });
    if (!confirmed) return;
    try {
      await ApiClient.delete(`/v1/sys/depts/${id}`);
      toast({ title: "成功", description: "删除部门成功" });
      fetchDepts();
    } catch (error) {
      toast({
        title: "错误",
        description: "删除部门失败",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    // 表单验证
    if (!currentDept.name?.trim()) {
      toast({ title: "错误", description: "请输入部门名称", variant: "destructive" });
      return;
    }

    if (currentDept.email && !/^[\w-]+(\.\w-]+)*@[\w-]+(\.\w-]+)+$/.test(currentDept.email)) {
      toast({ title: "错误", description: "无效的邮箱地址", variant: "destructive" });
      return;
    }

    if (currentDept.phone && !/^1[3-9]\d{9}$/.test(currentDept.phone)) {
      toast({ title: "错误", description: "请输入正确的手机号码", variant: "destructive" });
      return;
    }

    try {
      if (currentDept.id) {
        await ApiClient.put(`/v1/sys/depts/${currentDept.id}`, currentDept);
        toast({ title: "成功", description: "更新部门成功" });
      } else {
        await ApiClient.post('/v1/sys/depts', currentDept);
        toast({ title: "成功", description: "新增部门成功" });
      }
      setIsDialogOpen(false);
      fetchDepts();
    } catch (error) {
      toast({
        title: "错误",
        description: "保存部门失败",
        variant: "destructive",
      });
    }
  };

  // 递归渲染部门选项（用于父级选择器）
  const renderDeptOptions = (depts: Dept[], level: number = 0): React.ReactElement[] => {
    return depts.flatMap(dept => [
      <SelectItem 
        key={dept.id} 
        value={dept.id.toString()}
        disabled={currentDept.id === dept.id}  // 禁止选择自己
      >
        {'　'.repeat(level)}{dept.name}
      </SelectItem>,
      ...(dept.children ? renderDeptOptions(dept.children, level + 1) : [])
    ]);
  };

  const renderDeptTree = (depts: Dept[], level: number = 0) => {
    return depts.map((dept) => (
      <div key={dept.id}>
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-border hover:bg-accent/50 transition-colors"
          style={{ paddingLeft: `${level * 24 + 16}px` }}
        >
          <div className="flex items-center gap-3 flex-1">
            {dept.children && dept.children.length > 0 ? (
              <button
                onClick={() => handleToggle(dept.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                {expandedKeys.has(dept.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground text-sm font-medium">{dept.name}</span>
            <Badge
              variant={dept.status === 1 ? "default" : "secondary"}
              className={dept.status === 1 ? "bg-green-500/10 text-green-500 border-green-500/20 text-xs" : "bg-muted text-muted-foreground border-border text-xs"}
            >
              {dept.status === 1 ? '正常' : '停用'}
            </Badge>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="w-20">{dept.leader || '-'}</span>
            <span className="w-28">{dept.phone || '-'}</span>
            <span className="w-32">{dept.email || '-'}</span>
            <span className="w-16 text-center">{dept.sort}</span>
            <span className="w-28">{dept.created_time?.split(' ')[0] || '-'}</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAdd(dept.id)}
                className="text-muted-foreground hover:text-foreground hover:bg-accent h-7 w-7 p-0"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(dept)}
                className="text-muted-foreground hover:text-foreground hover:bg-accent h-7 w-7 p-0"
              >
                <Edit className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(dept.id)}
                disabled={dept.id === 1}  // 根部门禁止删除
                className={`h-7 w-7 p-0 ${
                  dept.id === 1 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                }`}
                title={dept.id === 1 ? '根部门不可删除' : '删除部门'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
        {dept.children && dept.children.length > 0 && expandedKeys.has(dept.id) && (
          renderDeptTree(dept.children, level + 1)
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">部门管理</h1>
          <p className="text-muted-foreground text-sm mt-1">组织架构部门管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={expandAll} className="border-border hover:bg-accent text-sm">
            <ChevronsDown className="w-4 h-4 mr-2" />
            展开全部
          </Button>
          <Button variant="outline" onClick={collapseAll} className="border-border hover:bg-accent text-sm">
            <ChevronsUp className="w-4 h-4 mr-2" />
            折叠全部
          </Button>
          <Button variant="outline" onClick={fetchDepts} className="border-border hover:bg-accent text-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button onClick={() => handleAdd()} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            新增部门
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card min-h-[calc(100vh-200px)]">
        <CardContent className="p-6 h-full">
          <div className="flex items-end gap-4 mb-4">
            <div className="flex-1">
              <Label className="text-muted-foreground mb-2 block text-sm">部门名称</Label>
              <Input
                placeholder="请输入部门名称"
                value={searchParams.name}
                onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
                className="bg-input border-border text-foreground text-sm"
              />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground mb-2 block text-sm">负责人</Label>
              <Input
                placeholder="请输入负责人"
                value={searchParams.leader}
                onChange={(e) => setSearchParams(prev => ({ ...prev, leader: e.target.value }))}
                className="bg-input border-border text-foreground text-sm"
              />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground mb-2 block text-sm">手机号码</Label>
              <Input
                placeholder="请输入手机号码"
                value={searchParams.phone}
                onChange={(e) => setSearchParams(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-input border-border text-foreground text-sm"
              />
            </div>
            <div className="flex-1">
              <Label className="text-muted-foreground mb-2 block text-sm">状态</Label>
              <Select 
                value={searchParams.status?.toString() || 'all'} 
                onValueChange={(value) => setSearchParams(prev => ({ 
                  ...prev, 
                  status: value === 'all' ? undefined : Number(value)  // 'all' 转为 undefined
                }))}
              >
                <SelectTrigger className="bg-input border-border text-foreground text-sm">
                  <SelectValue placeholder="全部" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="1">正常</SelectItem>
                  <SelectItem value="0">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={fetchDepts} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
              查询
            </Button>
            <Button variant="outline" onClick={() => { setSearchParams({ name: '', leader: '', phone: '' }); setTimeout(fetchDepts, 0); }} className="border-border hover:bg-accent text-sm">
              重置
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-4" />
                <span>部门名称</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="w-20">负责人</span>
                <span className="w-28">联系电话</span>
                <span className="w-32">邮箱</span>
                <span className="w-16 text-center">排序</span>
                <span className="w-28">创建时间</span>
                <span className="w-24 text-right">操作</span>
              </div>
            </div>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">加载中...</div>
            ) : depts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">暂无数据</div>
            ) : (
              renderDeptTree(depts)
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {currentDept.id ? '编辑部门' : '新增部门'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-muted-foreground text-sm">部门名称 <span className="text-destructive">*</span></Label>
              <Input
                value={currentDept.name || ''}
                onChange={(e) => setCurrentDept(prev => ({ ...prev, name: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入部门名称"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">父级部门</Label>
              <Select
                value={currentDept.parent_id?.toString() || 'null'}
                onValueChange={(value) => setCurrentDept(prev => ({ 
                  ...prev, 
                  parent_id: value === 'null' ? null : Number(value)
                }))}
              >
                <SelectTrigger className="bg-input border-border text-foreground mt-2 text-sm">
                  <SelectValue placeholder="选择父级部门（不选则为顶级）" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectItem value="null">无（顶级部门）</SelectItem>
                  {renderDeptOptions(depts)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">负责人</Label>
              <Input
                value={currentDept.leader || ''}
                onChange={(e) => setCurrentDept(prev => ({ ...prev, leader: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入负责人"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">联系电话</Label>
              <Input
                value={currentDept.phone || ''}
                onChange={(e) => setCurrentDept(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入联系电话"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">邮箱</Label>
              <Input
                value={currentDept.email || ''}
                onChange={(e) => setCurrentDept(prev => ({ ...prev, email: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入邮箱"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">排序</Label>
              <Input
                type="number"
                value={currentDept.sort || 0}
                onChange={(e) => setCurrentDept(prev => ({ ...prev, sort: Number(e.target.value) }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="数字越小越靠前"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">状态 <span className="text-destructive">*</span></Label>
              <RadioGroup 
                value={currentDept.status?.toString() || '1'}
                onValueChange={(value: string) => setCurrentDept(prev => ({ 
                  ...prev, 
                  status: Number(value)
                }))}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="status-1" />
                  <Label htmlFor="status-1" className="cursor-pointer font-normal text-sm">正常</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="status-0" />
                  <Label htmlFor="status-0" className="cursor-pointer font-normal text-sm">停用</Label>
                </div>
              </RadioGroup>
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
