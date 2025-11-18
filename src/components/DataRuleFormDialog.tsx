import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataRuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: any;
  onSubmit: (data: any) => Promise<void>;
  mode: 'create' | 'edit';
}

export default function DataRuleFormDialog({ open, onOpenChange, rule, onSubmit, mode }: DataRuleFormDialogProps) {
  const [formData, setFormData] = useState({ name: '', code: '', column: '', operator: '=', value: '', remark: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && rule && mode === 'edit') {
      setFormData({
        name: rule.name || '',
        code: rule.code || '',
        column: rule.column || '',
        operator: rule.operator || '=',
        value: rule.value || '',
        remark: rule.remark || ''
      });
    } else if (open && mode === 'create') {
      setFormData({ name: '', code: '', column: '', operator: '=', value: '', remark: '' });
    }
  }, [open, rule, mode]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.code || !formData.column) {
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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? '新增数据规则' : '编辑数据规则'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">规则名称 <span className="text-red-500">*</span></Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">规则编码 <span className="text-red-500">*</span></Label>
              <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} disabled={mode === 'edit'} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="column">字段�?<span className="text-red-500">*</span></Label>
            <Input id="column" value={formData.column} onChange={(e) => setFormData({ ...formData, column: e.target.value })} placeholder="例如: dept_id" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operator">运算�?/Label>
              <Select value={formData.operator} onValueChange={(value) => setFormData({ ...formData, operator: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="=">=</SelectItem>
                  <SelectItem value="!=">!=</SelectItem>
                  <SelectItem value=">">{">"}</SelectItem>
                  <SelectItem value="<">{"<"}</SelectItem>
                  <SelectItem value="IN">IN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">�?/Label>
              <Input id="value" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} placeholder="例如: 1,2,3" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="remark">备注</Label>
            <textarea id="remark" value={formData.remark} onChange={(e) => setFormData({ ...formData, remark: e.target.value })} className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
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
