import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Menu, Database, Activity, ArrowUpRight, ArrowDownRight, Clock, Bell } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface DashboardStats {
  userCount: number;
  roleCount: number;
  menuCount: number;
  onlineUsers: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    userCount: 0,
    roleCount: 0,
    menuCount: 0,
    onlineUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取统计数据
    setTimeout(() => {
      setStats({
        userCount: 128,
        roleCount: 8,
        menuCount: 24,
        onlineUsers: 12,
      });
      setLoading(false);
    }, 500);
  }, []);

  const statCards = [
    {
      title: '用户总数',
      value: stats.userCount,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: '角色数量',
      value: stats.roleCount,
      icon: Shield,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: '菜单数量',
      value: stats.menuCount,
      icon: Menu,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: '在线用户',
      value: stats.onlineUsers,
      icon: Activity,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 欢迎信息卡片 */}
      <Card className="border-border bg-gradient-to-br from-primary/10 via-card to-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg">
                {user?.nickname?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold text-foreground">
                    欢迎回来，{user?.nickname || user?.username}
                  </h1>
                  <Badge variant="secondary" className="text-xs">
                    管理员
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bell className="w-4 h-4" />
                    <span>3 条新通知</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const trend = Math.random() > 0.5;
          const trendValue = (Math.random() * 20).toFixed(1);
          return (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-all group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-8 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-foreground">{card.value}</div>
                    <div className="flex items-center gap-1 mt-2">
                      {trend ? (
                        <>
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-500 font-medium">+{trendValue}%</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                          <span className="text-xs text-red-500 font-medium">-{trendValue}%</span>
                        </>
                      )}
                      <span className="text-xs text-muted-foreground ml-1">较上周</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 系统资源和快速操作 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* 系统资源使用情况 */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground text-base flex items-center justify-between">
              <span>系统资源</span>
              <Badge variant="outline" className="text-xs">实时监控</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CPU 使用率</span>
                <span className="text-foreground font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">内存使用率</span>
                <span className="text-foreground font-medium">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">磁盘使用率</span>
                <span className="text-foreground font-medium">52%</span>
              </div>
              <Progress value={52} className="h-2" />
            </div>
            <div className="pt-3 border-t border-border grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">系统版本</div>
                <div className="text-foreground font-medium">v1.0.0</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">运行环境</div>
                <div className="text-foreground font-medium">Production</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 快速操作 */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground text-base">快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/system/user" className="block p-3 bg-accent/50 hover:bg-accent rounded-lg transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-foreground font-medium text-sm">用户管理</div>
                    <div className="text-xs text-muted-foreground">管理系统用户</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </a>
            <a href="/system/role" className="block p-3 bg-accent/50 hover:bg-accent rounded-lg transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-foreground font-medium text-sm">角色管理</div>
                    <div className="text-xs text-muted-foreground">配置角色权限</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </a>
            <a href="/monitor/server" className="block p-3 bg-accent/50 hover:bg-accent rounded-lg transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Database className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-foreground font-medium text-sm">服务器监控</div>
                    <div className="text-xs text-muted-foreground">查看系统状态</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* 最近活动时间线 */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground text-base flex items-center justify-between">
            <span>最近活动</span>
            <Badge variant="secondary" className="text-xs">今天 4 条</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: '用户登录', user: 'admin', time: '刚刚', type: 'login', color: 'text-blue-500', bgColor: 'bg-blue-500' },
              { action: '创建角色', user: 'admin', time: '5分钟前', type: 'create', color: 'text-green-500', bgColor: 'bg-green-500' },
              { action: '修改菜单', user: 'admin', time: '10分钟前', type: 'update', color: 'text-orange-500', bgColor: 'bg-orange-500' },
              { action: '更新权限', user: 'admin', time: '15分钟前', type: 'setting', color: 'text-purple-500', bgColor: 'bg-purple-500' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 last:pb-0 border-b border-border last:border-0">
                <div className="relative">
                  <div className={`w-8 h-8 rounded-lg ${activity.bgColor}/10 flex items-center justify-center`}>
                    <Activity className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  {index < 3 && (
                    <div className="absolute left-1/2 top-8 w-px h-6 bg-border" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-foreground text-sm font-medium">{activity.action}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">操作人：{activity.user}</div>
                    </div>
                    <div className="text-muted-foreground text-xs">{activity.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
