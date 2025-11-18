import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserDropdown from './UserDropdown';
import { useAppStore } from '@/store/app';
import Breadcrumb from './Breadcrumb';

export default function Header() {
  const { toggleSidebar } = useAppStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-6">
      {/* 菜单切换按钮 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="text-muted-foreground hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* 面包�?*/}
      <Breadcrumb />

      {/* 搜索�?*/}
      <div className="flex flex-1 items-center gap-4 md:ml-auto md:flex-initial">
        <div className="relative hidden md:block md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索..."
            className="pl-9"
          />
        </div>
      </div>

      {/* 通知按钮 */}
      <Button
        variant="ghost"
        size="icon"
        className="relative text-muted-foreground hover:text-foreground"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-1 top-1 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
        </span>
      </Button>

      {/* 用户下拉菜单 */}
      <UserDropdown />
    </header>
  );
}
