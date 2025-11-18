import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Shield, Menu, Building2, Database, 
  Clock, FileText, Monitor, Server, Calendar, Settings, Book, Puzzle, Bell,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
          { title: '数据范围', path: '/system/data-scope', icon: Database },
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

export default function SimpleSidebar() {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['0', '1', '2', '3']));

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
    <div className="fixed left-0 top-0 h-screen w-56 bg-[#141414] flex flex-col z-50 border-r border-[#2a2a2a]">
      <div className="px-5 py-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
            <span className="text-black font-bold text-sm">F</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm">FastAPI Platform</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleGroup(String(index))}
                  className="w-full flex items-center justify-between px-3 py-2 text-gray-400 text-xs hover:text-gray-300 hover:bg-[#1e1e1e] rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  {expandedGroups.has(String(index)) ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>
                {expandedGroups.has(String(index)) && (
                  <div className="space-y-1 mt-1">
                    {item.children.map((child, childIndex) => {
                      // 如果有嵌套子菜单（如数据权限）
                      if (child.children) {
                        const childKey = `${index}-${childIndex}`;
                        return (
                          <div key={childIndex} className="ml-4">
                            <button
                              onClick={() => toggleGroup(childKey)}
                              className="w-full flex items-center justify-between px-3 py-1.5 text-gray-500 text-xs hover:text-gray-300 hover:bg-[#1e1e1e] rounded-md transition-colors"
                            >
                              <div className="flex items-center">
                                <child.icon className="inline w-4 h-4 mr-2" />
                                {child.title}
                              </div>
                              {expandedGroups.has(childKey) ? (
                                <ChevronDown className="w-3 h-3" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                            </button>
                            {expandedGroups.has(childKey) && (
                              <div className="space-y-1 mt-1">
                                {child.children.map((subChild: any) => {
                                  const isActive = location.pathname === subChild.path;
                                  return (
                                    <Link
                                      key={subChild.path}
                                      to={subChild.path}
                                      className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors ml-4",
                                        isActive
                                          ? "bg-[#2a2a2a] text-white font-medium"
                                          : "text-gray-500 hover:bg-[#1e1e1e] hover:text-gray-300"
                                      )}
                                    >
                                      <subChild.icon className="w-4 h-4" />
                                      {subChild.title}
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
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors ml-4",
                            isActive
                              ? "bg-[#2a2a2a] text-white font-medium"
                              : "text-gray-500 hover:bg-[#1e1e1e] hover:text-gray-300"
                          )}
                        >
                          <child.icon className="w-4 h-4" />
                          {child.title}
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
    </div>
  );
}
