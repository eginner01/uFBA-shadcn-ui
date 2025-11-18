import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function RolePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">角色管理</h1>
          <p className="text-muted-foreground">管理系统角色和权限配�?/p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新增角色
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>角色列表</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">角色列表功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  );
}
