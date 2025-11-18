import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DataScopeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope?: any;
  onSubmit: (data: any) => Promise<void>;
  mode: 'create' | 'edit';
}

export default function DataScopeFormDialog({ open, onOpenChange, scope, onSubmit, mode }: DataScopeFormDialogProps) {
  const [formData, setFormData] = useState({ name: '', code: '', remark: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && scope && mode === 'edit') {
      setFormData({ name: scope.name || '', code: scope.code || '', remark: scope.remark || '' });
    } else if (open && mode === 'create') {
      setFormData({ name: '', code: '', remark: '' });
    }
  }, [open, scope, mode]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.code) {
      alert('请填写必填项');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      alert('提交失败: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? '新增数据范围' : '编辑数据范围'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">范围名称 <span className="text-red-500">*</span></Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">范围编码 <span className="text-red-500">*</span></Label>
            <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} disabled={mode === 'edit'} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remark">备注</Label>
            <textarea id="remark" value={formData.remark} onChange={(e) => setFormData({ ...formData, remark: e.target.value })} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
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
