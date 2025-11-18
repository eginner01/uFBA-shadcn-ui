import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeptFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dept?: any;
  onSubmit: (data: any) => Promise<void>;
  mode: 'create' | 'edit';
}

export default function DeptFormDialog({ open, onOpenChange, dept, onSubmit, mode }: DeptFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    leader: '',
    phone: '',
    email: '',
    sort: 0,
    parent_id: undefined as number | undefined,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && dept && mode === 'edit') {
      setFormData({
        name: dept.name || '',
        leader: dept.leader || '',
        phone: dept.phone || '',
        email: dept.email || '',
        sort: dept.sort || 0,
        parent_id: dept.parent_id,
      });
    } else if (open && mode === 'create') {
      setFormData({ name: '', leader: '', phone: '', email: '', sort: 0, parent_id: undefined });
    }
  }, [open, dept, mode]);

  const handleSubmit = async () => {
    if (!formData.name) {
      alert('请输入部门名�?);
      return;
    }

    const submitData = {
      ...formData,
      leader: formData.leader || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
    };

    setLoading(true);
    try {
      await onSubmit(submitData);
      onOpenChange(false);
    } catch (error) {
      alert('提交失败: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? '新增部门' : '编辑部门'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">部门名称 <span className="text-red-500">*</span></Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leader">负责�?/Label>
              <Input id="leader" value={formData.leader} onChange={(e) => setFormData({ ...formData, leader: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">联系电话</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort">排序</Label>
              <Input id="sort" type="number" value={formData.sort} onChange={(e) => setFormData({ ...formData, sort: Number(e.target.value) })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>取消</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? '提交�?..' : '确定'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
