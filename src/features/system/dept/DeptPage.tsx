import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function DeptPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">部门管理</h1>
          <p className="text-muted-foreground">管理组织架构和部门信�?/p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新增部门
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>部门�?/CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">部门树功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  );
}
