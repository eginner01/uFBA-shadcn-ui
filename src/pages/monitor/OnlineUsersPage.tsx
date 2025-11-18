import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, LogOut } from "lucide-react";
import { getOnlineUsersApi, kickOutUserApi } from '@/api/monitor';
import { useToast } from "@/components/ui/use-toast";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";

interface OnlineUser {
  id: number;
  session_uuid: string;
  username: string;
  nickname: string;
  ip: string;
  location?: string;
  browser?: string;
  os?: string;
  login_time: string;
}

export default function OnlineUsersPage() {
  const { toast } = useToast();
  const { confirm } = useConfirmDialog();
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response: any = await getOnlineUsersApi();
      setUsers(response || []);
    } catch (error) {
      toast({ title: "错误", description: "获取在线用户失败", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleKickOut = async (id: number, session_uuid: string, username: string) => {
    const confirmed = await confirm({
      title: '强制下线',
      description: `确认强制下线用户「${username}」？`,
      confirmText: '强制下线',
      type: 'error',
    });
    if (!confirmed) return;
    try {
      await kickOutUserApi(id, session_uuid);
      toast({ title: "成功", description: "用户已下线" });
      fetchUsers();
    } catch (error) {
      toast({ title: "错误", description: "操作失败", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">在线用户</h1>
          <p className="text-muted-foreground text-sm mt-1">当前系统在线用户列表</p>
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="border-emerald-500 text-emerald-400">
            在线: {users.length} 人
          </Badge>
          <Button variant="outline" onClick={fetchUsers} className="border-border hover:bg-accent text-sm" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card min-h-[calc(100vh-200px)]">
        <CardContent className="p-6 h-full">
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="text-xs">用户名</TableHead>
                  <TableHead className="text-xs">IP地址</TableHead>
                  <TableHead className="text-xs">登录地点</TableHead>
                  <TableHead className="text-xs">浏览器</TableHead>
                  <TableHead className="text-xs">操作系统</TableHead>
                  <TableHead className="text-xs w-40">登录时间</TableHead>
                  <TableHead className="text-xs w-24 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">加载中...</TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">暂无在线用户</TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="border-border">
                      <TableCell className="font-medium text-sm">{user.username}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{user.ip}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{user.location || '-'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{user.browser || '-'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{user.os || '-'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{user.login_time}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleKickOut(user.id, user.session_uuid, user.username)}
                          className="hover:bg-accent text-destructive"
                        >
                          <LogOut className="w-4 h-4 mr-1" />
                          强制下线
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
