import { Outlet } from 'react-router-dom';
import ModernSidebar from '../components/ModernSidebar';
import AppHeader from '../components/AppHeader';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* 侧边栏 - 固定256px宽度 */}
      <ModernSidebar />
      
      {/* 主内容区 - 精确对齐 */}
      <div className="flex-1 flex flex-col ml-64 h-screen overflow-hidden">
        {/* 顶部Header */}
        <AppHeader />
        
        {/* 内容区域 - 填满剩余空间 */}
        <main className="flex-1 overflow-auto">
          <div className="h-full p-6 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
