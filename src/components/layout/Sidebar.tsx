import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Layers } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store/app';
import { routes } from '@/routes/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MenuItem {
  path: string;
  title: string;
  icon?: any;
  children?: MenuItem[];
}

// 转换路由为菜单项
function getMenuItems(): MenuItem[] {
  const mainRoute = routes.find((r) => r.path === '/');
  if (!mainRoute?.children) return [];

  return mainRoute.children
    .filter((route) => route.meta && !route.meta.hidden)
    .map((route) => ({
      path: route.path || '',
      title: route.meta!.title,
      icon: route.meta!.icon,
      children: route.children
        ?.filter((child) => child.meta && !child.meta.hidden)
        .map((child) => ({
          path: `${route.path}/${child.path}`,
          title: child.meta!.title,
          icon: child.meta!.icon,
        })),
    }));
}

export default function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed } = useAppStore();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const menuItems = getMenuItems();

  const toggleMenu = (path: string) => {
    setOpenMenus((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(`/${path}`);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 h-screen border-r bg-card transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Layers className="h-6 w-6 text-primary" />
        {!sidebarCollapsed && (
          <span className="ml-2 text-lg font-semibold">Admin</span>
        )}
      </div>

      {/* 菜单 */}
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <nav className="space-y-1 p-4">
          {menuItems.map((item) => (
            <div key={item.path}>
              {/* 父菜�?*/}
              {item.children ? (
                <div>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start',
                      isActive(item.path) && 'bg-accent text-accent-foreground'
                    )}
                    onClick={() => toggleMenu(item.path)}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    {!sidebarCollapsed && (
                      <>
                        <span className="ml-2 flex-1 text-left">{item.title}</span>
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 transition-transform',
                            openMenus.includes(item.path) && 'rotate-90'
                          )}
                        />
                      </>
                    )}
                  </Button>

                  {/* 子菜�?*/}
                  {!sidebarCollapsed && openMenus.includes(item.path) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link key={child.path} to={`/${child.path}`}>
                          <Button
                            variant="ghost"
                            className={cn(
                              'w-full justify-start',
                              location.pathname === `/${child.path}` &&
                                'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                            )}
                          >
                            {child.icon && <child.icon className="h-4 w-4" />}
                            <span className="ml-2">{child.title}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link to={`/${item.path}`}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start',
                      location.pathname === `/${item.path}` &&
                        'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                    )}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    {!sidebarCollapsed && (
                      <span className="ml-2">{item.title}</span>
                    )}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
