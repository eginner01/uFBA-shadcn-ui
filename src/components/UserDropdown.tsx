import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Settings } from 'lucide-react';

export default function UserDropdown() {
  const { user, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} alt={user?.nickname} />
            <AvatarFallback className="bg-orange-500 text-white">
              {user?.nickname?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#1e1e1e] border-[#333333]" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">{user?.nickname || user?.username}</p>
            <p className="text-xs leading-none text-gray-400">{user?.email || ''}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#333333]" />
        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#252525] cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>个人中心</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#252525] cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>系统设置</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#333333]" />
        <DropdownMenuItem onClick={logout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
