import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function MenuPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">菜单管理</h1>
          <p className="text-muted-foreground">管理系统菜单和路由配�?/p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新增菜单
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>菜单列表</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">菜单列表功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  );
}
