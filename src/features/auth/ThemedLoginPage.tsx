import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Shield, User, Lock, Mail } from 'lucide-react';

export default function ThemedLoginPage() {
  const [adminData, setAdminData] = useState({ username: '', password: '' });
  const [memberData, setMemberData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert(`管理员登�? ${adminData.username}`);
      setLoading(false);
    }, 1000);
  };

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert(`成员登录: ${memberData.email}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">FastAPI Admin</CardTitle>
          <CardDescription>企业级后台管理系�?/CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">
                <Shield className="mr-2 h-4 w-4" />
                管理�?
              </TabsTrigger>
              <TabsTrigger value="member">
                <User className="mr-2 h-4 w-4" />
                成员
              </TabsTrigger>
            </TabsList>

            {/* 管理员登�?*/}
            <TabsContent value="admin" className="mt-6">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">用户�?/label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="请输入管理员账号"
                      value={adminData.username}
                      onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="请输入密�?
                      value={adminData.password}
                      onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" />
                    <span className="text-muted-foreground">记住�?/span>
                  </label>
                  <button type="button" className="text-primary hover:underline">
                    忘记密码?
                  </button>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '登录�?..' : '登录'}
                </Button>

                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="text-muted-foreground">
                    测试账号: <code className="font-mono text-primary">admin / 123456</code>
                  </p>
                </div>
              </form>
            </TabsContent>

            {/* 成员登录 */}
            <TabsContent value="member" className="mt-6">
              <form onSubmit={handleMemberLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">邮箱</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="请输入邮箱地址"
                      value={memberData.email}
                      onChange={(e) => setMemberData({ ...memberData, email: e.target.value })}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="请输入密�?
                      value={memberData.password}
                      onChange={(e) => setMemberData({ ...memberData, password: e.target.value })}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" />
                    <span className="text-muted-foreground">记住�?/span>
                  </label>
                  <button type="button" className="text-primary hover:underline">
                    忘记密码?
                  </button>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '登录�?..' : '登录'}
                </Button>

                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="text-muted-foreground">
                    测试账号: <code className="font-mono text-primary">test@example.com / 123456</code>
                  </p>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>© 2024 FastAPI Admin. All rights reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
