import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, ChevronRight } from 'lucide-react';
import { useMenuStore } from '../store/menu';
import type { SidebarMenu } from '../api/menu';
import i18n from '../locales/zh-CN';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu as SidebarMenuComponent,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import UserDropdown from './UserDropdown';

// 翻译函数
function translateTitle(key: string): string {
  if (!key.includes('.')) return key;
  const parts = key.split('.');
  let value: any = i18n;
  for (const part of parts) {
    value = value?.[part];
    if (!value) return key;
  }
  return typeof value === 'string' ? value : key;
}

export function AppSidebar() {
  const { menus, fetchMenus, loading } = useMenuStore();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // 组件加载时获取菜�?
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (menus.length === 0 && token && !loading) {
      console.log('[AppSidebar] Fetching menus from backend...');
      fetchMenus();
    }
  }, []);

  // 自动展开包含当前路由的父级菜�?
  useEffect(() => {
    if (menus.length > 0) {
      console.log('[AppSidebar] Processing menus:', menus.length);
      const newExpanded = new Set<number>();
      menus.forEach(menu => {
        console.log(`[AppSidebar] Menu: ${menu.meta.title}, has children: ${!!menu.children}, children count: ${menu.children?.length || 0}`);
        if (menu.children && menu.children.length > 0) {
          const hasActiveChild = menu.children.some(child => 
            isActiveRoute(child.path)
          );
          if (hasActiveChild) {
            newExpanded.add(menu.id);
            console.log(`[AppSidebar] Auto-expanding menu: ${menu.meta.title}`);
          }
        }
      });
      setExpandedItems(newExpanded);
    }
  }, [location.pathname, menus]);

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (menu: SidebarMenu) => {
    if (menu.meta.hideInMenu) return null;
    
    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expandedItems.has(menu.id);
    const title = translateTitle(menu.meta.title);
    const isActive = isActiveRoute(menu.path);

    if (hasChildren) {
      return (
        <SidebarMenuItem key={menu.id}>
          <SidebarMenuButton
            onClick={() => toggleExpand(menu.id)}
            isActive={isActive}
          >
            <span>{title}</span>
            <ChevronRight 
              className={`ml-auto transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
            />
          </SidebarMenuButton>
          {isExpanded && (
            <SidebarMenuSub>
              {menu.children?.map(child => {
                const childTitle = translateTitle(child.meta.title);
                const childActive = isActiveRoute(child.path);
                return (
                  <SidebarMenuSubItem key={child.id}>
                    <SidebarMenuSubButton asChild isActive={childActive}>
                      <Link to={child.path}>
                        <span>{childTitle}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={menu.id}>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link to={menu.path}>
            <span>{title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon">
      {/* 头部 */}
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold">FastAPI Admin</span>
            <span className="truncate text-xs text-muted-foreground">企业�?/span>
          </div>
        </div>
      </SidebarHeader>

      {/* 内容区域 */}
      <SidebarContent>
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            加载�?..
          </div>
        ) : menus.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            暂无菜单
          </div>
        ) : (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenuComponent>
                {menus.map(menu => renderMenuItem(menu))}
              </SidebarMenuComponent>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* 底部用户信息 */}
      <SidebarFooter>
        <UserDropdown />
      </SidebarFooter>
    </Sidebar>
  );
}
