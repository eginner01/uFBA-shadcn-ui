import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppStore } from '@/store/app';
import { cn } from '@/lib/utils';

export default function BasicLayout() {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* 侧边�?*/}
      <Sidebar />

      {/* 主内容区 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 顶栏 */}
        <Header />

        {/* 内容 */}
        <main
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden bg-background p-6 transition-all duration-300',
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          )}
        >
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
