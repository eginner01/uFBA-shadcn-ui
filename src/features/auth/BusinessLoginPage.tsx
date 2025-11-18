import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Shield, Users, Lock, ArrowRight } from 'lucide-react';

export default function BusinessLoginPage() {
  const [adminData, setAdminData] = useState({ username: '', password: '' });
  const [memberData, setMemberData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('admin');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert(`管理员登录成功！用户�? ${adminData.username}`);
      setLoading(false);
    }, 1000);
  };

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert(`成员登录成功！邮�? ${memberData.email}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* 左侧 - 品牌展示�?*/}
      <div className="hidden w-1/2 bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">FastAPI Admin</h1>
              <p className="text-sm text-orange-200">企业级管理系�?/p>
            </div>
          </div>

          {/* 特性介�?*/}
          <div className="mt-20 space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
                <Shield className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-white">安全可靠</h3>
                <p className="text-sm text-slate-400">企业级安全防护，数据加密传输</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
                <Users className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-white">权限管理</h3>
                <p className="text-sm text-slate-400">灵活的角色权限控制体�?/p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
                <Lock className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-white">数据隔离</h3>
                <p className="text-sm text-slate-400">多租户数据完全隔离保�?/p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="text-sm text-slate-400">
          <p>© 2024 FastAPI Admin. All rights reserved.</p>
          <p className="mt-1">Powered by FastAPI + React + Shadcn UI</p>
        </div>
      </div>

      {/* 右侧 - 登录表单�?*/}
      <div className="flex w-full flex-col justify-center bg-white px-8 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* 移动�?Logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">FastAPI Admin</h1>
            </div>
          </div>

          {/* 欢迎标题 */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">欢迎回来</h2>
            <p className="mt-2 text-slate-600">请选择登录方式并输入凭�?/p>
          </div>

          {/* 登录方式切换 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100">
              <TabsTrigger 
                value="admin" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <Shield className="mr-2 h-4 w-4" />
                管理员登�?
              </TabsTrigger>
              <TabsTrigger 
                value="member"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <Users className="mr-2 h-4 w-4" />
                成员登录
              </TabsTrigger>
            </TabsList>

            {/* 管理员登录表�?*/}
            <TabsContent value="admin" className="mt-6">
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    管理员账�?
                  </label>
                  <Input
                    type="text"
                    placeholder="请输入管理员账号"
                    value={adminData.username}
                    onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                    className="h-11 border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    密码
                  </label>
                  <Input
                    type="password"
                    placeholder="请输入密�?
                    value={adminData.password}
                    onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                    className="h-11 border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                    <span className="text-slate-600">记住�?/span>
                  </label>
                  <button type="button" className="text-orange-500 hover:text-orange-600">
                    忘记密码�?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full bg-orange-500 text-base font-medium hover:bg-orange-600"
                >
                  {loading ? '登录�?..' : (
                    <>
                      登录
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                  <p className="text-slate-600">
                    <span className="font-medium">测试账号�?/span>
                    <code className="ml-2 text-orange-600">admin / 123456</code>
                  </p>
                </div>
              </form>
            </TabsContent>

            {/* 成员登录表单 */}
            <TabsContent value="member" className="mt-6">
              <form onSubmit={handleMemberLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    邮箱地址
                  </label>
                  <Input
                    type="email"
                    placeholder="请输入邮箱地址"
                    value={memberData.email}
                    onChange={(e) => setMemberData({ ...memberData, email: e.target.value })}
                    className="h-11 border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    密码
                  </label>
                  <Input
                    type="password"
                    placeholder="请输入密�?
                    value={memberData.password}
                    onChange={(e) => setMemberData({ ...memberData, password: e.target.value })}
                    className="h-11 border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                    <span className="text-slate-600">记住�?/span>
                  </label>
                  <button type="button" className="text-orange-500 hover:text-orange-600">
                    忘记密码�?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full bg-orange-500 text-base font-medium hover:bg-orange-600"
                >
                  {loading ? '登录�?..' : (
                    <>
                      登录
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                  <p className="text-slate-600">
                    <span className="font-medium">测试账号�?/span>
                    <code className="ml-2 text-orange-600">test@example.com / 123456</code>
                  </p>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          {/* 注册提示 */}
          <div className="mt-8 text-center text-sm text-slate-600">
            还没有账号？
            <button className="ml-1 font-medium text-orange-500 hover:text-orange-600">
              联系管理员开�?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
