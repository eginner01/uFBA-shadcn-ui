import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Menu, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { userInfo } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* 欢迎信息 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表�?/h1>
        <p className="text-muted-foreground">
          欢迎回来，{userInfo?.nickname || userInfo?.username}�?
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">用户总数</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+10% 较上�?/p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">角色数量</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">+2 本月新增</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">菜单数量</CardTitle>
            <Menu className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">系统功能模块</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日活跃</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">+19% 较昨�?/p>
          </CardContent>
        </Card>
      </div>

      {/* 快速操�?*/}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>快速开�?/CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center justify-center rounded-lg border border-primary/20 p-6 text-center transition-colors hover:bg-accent">
              <Users className="mb-2 h-8 w-8 text-primary" />
              <h3 className="font-semibold">用户管理</h3>
              <p className="text-sm text-muted-foreground">管理系统用户</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border border-primary/20 p-6 text-center transition-colors hover:bg-accent">
              <Shield className="mb-2 h-8 w-8 text-primary" />
              <h3 className="font-semibold">角色管理</h3>
              <p className="text-sm text-muted-foreground">配置用户角色</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border border-primary/20 p-6 text-center transition-colors hover:bg-accent">
              <Menu className="mb-2 h-8 w-8 text-primary" />
              <h3 className="font-semibold">菜单管理</h3>
              <p className="text-sm text-muted-foreground">设置系统菜单</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 用户信息 */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>当前用户信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">用户名：</span>
              <span className="font-medium">{userInfo?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">昵称�?/span>
              <span className="font-medium">{userInfo?.nickname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">邮箱�?/span>
              <span className="font-medium">{userInfo?.email || '未设�?}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">角色�?/span>
              <span className="font-medium">
                {userInfo?.roles?.map((r) => r.name).join(', ') || '�?}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">状态：</span>
              <span className="font-medium text-green-500">在线</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
