import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Shield, Menu, Building2, Database, 
  Clock, FileText, Monitor, Server, Calendar, Settings, Book, Puzzle, Bell,
  ChevronDown, ChevronRight, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const menuItems = [
  {
    title: '仪表盘',
    icon: LayoutDashboard,
    children: [
      { title: '分析页', path: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: '系统管理',
    icon: Settings,
    children: [
      { title: '部门管理', path: '/system/dept', icon: Building2 },
      { title: '用户管理', path: '/system/user', icon: Users },
      { title: '角色管理', path: '/system/role', icon: Shield },
      { title: '菜单管理', path: '/system/menu', icon: Menu },
      { 
        title: '数据权限', 
        icon: Database,
        children: [
          { title: '数据范围', path: '/system/data-scope', icon: Layers },
          { title: '数据规则', path: '/system/data-rule', icon: Database },
        ]
      },
      { title: '插件管理', path: '/system/plugin', icon: Puzzle },
      { title: '参数设置', path: '/plugins/config', icon: Settings },
      { title: '字典管理', path: '/plugins/dict', icon: Book },
      { title: '通知公告', path: '/plugins/notice', icon: Bell },
      { title: '代码生成', path: '/plugins/code-generator', icon: FileText },
    ],
  },
  {
    title: '日志管理',
    icon: FileText,
    children: [
      { title: '登录日志', path: '/log/login', icon: Clock },
      { title: '操作日志', path: '/log/opera', icon: FileText },
    ],
  },
  {
    title: '系统监控',
    icon: Monitor,
    children: [
      { title: '在线用户', path: '/monitor/online', icon: Users },
      { title: 'Redis监控', path: '/monitor/redis', icon: Database },
      { title: '服务器监控', path: '/monitor/server', icon: Server },
    ],
  },
  {
    title: '任务调度',
    icon: Calendar,
    children: [
      { title: '任务管理', path: '/scheduler/manage', icon: Calendar },
      { title: '执行记录', path: '/scheduler/record', icon: FileText },
    ],
  },
];

export default function ModernSidebar() {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['0', '1', '2', '3', '4']));

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Logo Header */}
      <div className="px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-bold text-lg">U</span>
          </div>
          <div>
            <h1 className="text-sidebar-foreground font-semibold text-base">uFBA</h1>
            <p className="text-sidebar-foreground/60 text-xs">shadcn/ui</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleGroup(String(index))}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 text-sidebar-foreground/70 text-sm font-medium hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-all group",
                      expandedGroups.has(String(index)) && "text-sidebar-foreground bg-sidebar-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.children.length > 0 && (
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-sidebar-accent text-sidebar-foreground/60">
                          {item.children.length}
                        </Badge>
                      )}
                      {expandedGroups.has(String(index)) ? (
                        <ChevronDown className="w-4 h-4 transition-transform" />
                      ) : (
                        <ChevronRight className="w-4 h-4 transition-transform" />
                      )}
                    </div>
                  </button>
                  
                  {expandedGroups.has(String(index)) && (
                    <div className="mt-1 space-y-0.5 ml-3 pl-3 border-l-2 border-sidebar-border">
                      {item.children.map((child, childIndex) => {
                        // 处理嵌套子菜单
                        if (child.children) {
                          const childKey = `${index}-${childIndex}`;
                          return (
                            <div key={childIndex}>
                              <button
                                onClick={() => toggleGroup(childKey)}
                                className={cn(
                                  "w-full flex items-center justify-between px-3 py-2 text-sidebar-foreground/60 text-sm hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md transition-all",
                                  expandedGroups.has(childKey) && "text-sidebar-foreground bg-sidebar-accent/30"
                                )}
                              >
                                <div className="flex items-center gap-2.5">
                                  <child.icon className="w-4 h-4" />
                                  <span>{child.title}</span>
                                </div>
                                {expandedGroups.has(childKey) ? (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5" />
                                )}
                              </button>
                              {expandedGroups.has(childKey) && (
                                <div className="mt-0.5 space-y-0.5 ml-3">
                                  {child.children.map((subChild: any) => {
                                    const isActive = location.pathname === subChild.path;
                                    return (
                                      <Link
                                        key={subChild.path}
                                        to={subChild.path}
                                        className={cn(
                                          "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all relative",
                                          isActive
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                                            : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                                        )}
                                      >
                                        {isActive && (
                                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary-foreground rounded-r-full" />
                                        )}
                                        <subChild.icon className="w-4 h-4" />
                                        <span>{subChild.title}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }
                        
                        // 普通菜单项
                        const isActive = location.pathname === child.path;
                        return (
                          <Link
                            key={child.path}
                            to={child.path!}
                            className={cn(
                              "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all relative group",
                              isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                                : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                            )}
                          >
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary-foreground rounded-r-full" />
                            )}
                            <child.icon className="w-4 h-4" />
                            <span>{child.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <Users className="w-4 h-4 text-sidebar-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground text-sm font-medium truncate">管理员</p>
            <p className="text-sidebar-foreground/60 text-xs truncate">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
