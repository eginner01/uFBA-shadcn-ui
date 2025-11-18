import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Search, Settings, LogOut, User, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// 路由到中文名称的映射
const routeNameMap: Record<string, string> = {
  '/dashboard': '仪表盘',
  '/system/dept': '部门管理',
  '/system/user': '用户管理',
  '/system/role': '角色管理',
  '/system/menu': '菜单管理',
  '/system/data-scope': '数据范围',
  '/system/data-rule': '数据规则',
  '/system/plugin': '插件管理',
  '/plugins/config': '参数设置',
  '/plugins/dict': '字典管理',
  '/plugins/notice': '通知公告',
  '/plugins/code-generator': '代码生成',
  '/log/login': '登录日志',
  '/log/opera': '操作日志',
  '/monitor/online': '在线用户',
  '/monitor/redis': 'Redis监控',
  '/monitor/server': '服务器监控',
  '/scheduler/manage': '任务管理',
  '/scheduler/record': '执行记录',
};

export default function AppHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // 生成面包屑
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: '首页', path: '/dashboard' }];
    
    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const name = routeNameMap[currentPath] || path;
      if (index === paths.length - 1) {
        breadcrumbs.push({ name, path: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 flex-1">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-sm font-medium text-foreground">{crumb.name}</span>
              ) : (
                <Link 
                  to={crumb.path} 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2">
          {/* 搜索 */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="w-4 h-4" />
          </Button>

          {/* 通知 */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary">
              3
            </Badge>
          </Button>

          {/* 设置 */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="w-4 h-4" />
          </Button>

          {/* 分隔线 */}
          <div className="h-6 w-px bg-border mx-2" />

          {/* 用户菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.avatar || undefined} alt={user?.nickname} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user?.nickname?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.nickname || user?.username}</span>
                  <span className="text-xs text-muted-foreground">管理员</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                个人信息
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                账户设置
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
