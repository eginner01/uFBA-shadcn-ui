import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserInfo } from '../types/api';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserInfo | null;
  onSubmit: (data: any) => Promise<void>;
  mode: 'create' | 'edit';
}

export default function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  mode,
}: UserFormDialogProps) {
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    email: '',
    phone: '',
    password: '',
    dept_id: undefined as number | undefined,
    roles: [] as number[],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user && mode === 'edit') {
      setFormData({
        username: user.username || '',
        nickname: user.nickname || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        dept_id: (user as any).dept_id, // TODO: 更新UserInfo类型
        roles: (user as any).roles?.map((r: any) => r.id) || [],
      });
    } else if (open && mode === 'create') {
      setFormData({
        username: '',
        nickname: '',
        email: '',
        phone: '',
        password: '',
        dept_id: undefined,
        roles: [],
      });
    }
  }, [open, user, mode]);

  const handleSubmit = async () => {
    // 基础验证
    if (!formData.username) {
      alert('请输入用户名');
      return;
    }
    if (!formData.nickname) {
      alert('请输入昵�?);
      return;
    }
    if (mode === 'create' && !formData.password) {
      alert('请输入密�?);
      return;
    }

    // 处理空字符串字段：将空字符串转为undefined，避免后端验证失�?
    const submitData = {
      ...formData,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      dept_id: formData.dept_id || undefined,
    };

    setLoading(true);
    try {
      await onSubmit(submitData);
      onOpenChange(false);
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '新增用户' : '编辑用户'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {/* 用户�?*/}
          <div className="space-y-2">
            <Label htmlFor="username">
              用户�?<span className="text-red-500">*</span>
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={mode === 'edit'}
              placeholder="请输入用户名"
            />
          </div>

          {/* 昵称 */}
          <div className="space-y-2">
            <Label htmlFor="nickname">
              昵称 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nickname"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="请输入昵�?
            />
          </div>

          {/* 邮箱 */}
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="请输入邮�?
            />
          </div>

          {/* 手机�?*/}
          <div className="space-y-2">
            <Label htmlFor="phone">手机�?/Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="请输入手机号"
            />
          </div>

          {/* 密码 - 仅新增时显示 */}
          {mode === 'create' && (
            <div className="space-y-2 col-span-2">
              <Label htmlFor="password">
                密码 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="请输入初始密�?
              />
            </div>
          )}

          {/* 部门选择 - 简化版 */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="dept">所属部�?/Label>
            <Select
              value={formData.dept_id?.toString()}
              onValueChange={(value) => setFormData({ ...formData, dept_id: value ? Number(value) : undefined })}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">测试部门</SelectItem>
                {/* TODO: 动态加载部门列�?*/}
              </SelectContent>
            </Select>
          </div>

          {/* 角色选择 - 简化版 */}
          <div className="space-y-2 col-span-2">
            <Label>分配角色</Label>
            <div className="text-sm text-gray-500">
              TODO: 角色多选组件（当前简化实现）
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? '提交�?..' : '确定'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
