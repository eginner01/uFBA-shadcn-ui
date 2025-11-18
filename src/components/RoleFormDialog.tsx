import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: any;
  onSubmit: (data: any) => Promise<void>;
  mode: 'create' | 'edit';
}

export default function RoleFormDialog({ open, onOpenChange, role, onSubmit, mode }: RoleFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    sort: 0,
    status: 1,
    remark: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && role && mode === 'edit') {
      setFormData({
        name: role.name || '',
        code: role.code || '',
        sort: role.sort || 0,
        status: role.status ?? 1,
        remark: role.remark || '',
      });
    } else if (open && mode === 'create') {
      setFormData({ name: '', code: '', sort: 0, status: 1, remark: '' });
    }
  }, [open, role, mode]);

  const handleSubmit = async () => {
    if (!formData.name) {
      alert('请输入角色名�?);
      return;
    }
    if (!formData.code) {
      alert('请输入角色标�?);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? '新增角色' : '编辑角色'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">角色名称 <span className="text-red-500">*</span></Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">角色标识 <span className="text-red-500">*</span></Label>
              <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} disabled={mode === 'edit'} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort">排序</Label>
            <Input id="sort" type="number" value={formData.sort} onChange={(e) => setFormData({ ...formData, sort: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remark">备注</Label>
            <textarea 
              id="remark" 
              value={formData.remark} 
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
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
