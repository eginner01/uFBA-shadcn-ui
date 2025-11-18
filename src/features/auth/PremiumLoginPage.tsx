import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

export default function PremiumLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      console.log('登录:', username, password);
      alert(`登录成功！用户名: ${username}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950">
      {/* 动态背景渐�?*/}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-purple-600/20 to-pink-600/20" />
      
      {/* 动态光晕效�?*/}
      <div className="absolute -left-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-orange-500/30 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-purple-500/30 blur-3xl delay-700" />
      <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-pink-500/20 blur-3xl delay-1000" />

      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* 主要内容 */}
      <div className="relative z-10 mx-auto w-full max-w-md px-4">
        {/* 玻璃拟态卡�?*/}
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/10">
          {/* 顶部装饰光晕 */}
          <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 opacity-20 blur-3xl" />

          {/* Logo & 标题 */}
          <div className="relative mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 shadow-lg shadow-orange-500/50 transition-transform duration-300 group-hover:scale-110">
              <Shield className="h-10 w-10 text-white" strokeWidth={2} />
            </div>
            
            <div className="mb-2 flex items-center justify-center gap-2">
              <h1 className="bg-gradient-to-r from-orange-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent">
                FastAPI Admin
              </h1>
              <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            </div>
            
            <p className="text-sm text-slate-400">
              高端现代化管理系�?
            </p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 用户名输�?*/}
            <div className="group/input">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                用户�?
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-5 w-5 text-slate-400 transition-colors group-focus-within/input:text-orange-400" />
                </div>
                <Input
                  type="text"
                  placeholder="输入您的用户�?
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                  className="h-12 border-white/10 bg-white/5 pl-12 text-white placeholder:text-slate-500 focus:border-orange-500/50 focus:bg-white/10 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div className="group/input">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                密码
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-slate-400 transition-colors group-focus-within/input:text-purple-400" />
                </div>
                <Input
                  type="password"
                  placeholder="输入您的密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="h-12 border-white/10 bg-white/5 pl-12 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* 记住�?& 忘记密码 */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-400 transition-colors hover:text-slate-300">
                <input type="checkbox" className="h-4 w-4 rounded border-white/10 bg-white/5 text-orange-500 focus:ring-2 focus:ring-orange-500/20" />
                <span>记住�?/span>
              </label>
              <button type="button" className="text-orange-400 transition-colors hover:text-orange-300">
                忘记密码�?
              </button>
            </div>

            {/* 登录按钮 */}
            <Button
              type="submit"
              disabled={loading}
              className="group/btn relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 text-base font-semibold text-white shadow-lg shadow-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/50 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    登录�?..
                  </>
                ) : (
                  <>
                    立即登录
                    <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                  </>
                )}
              </span>
              
              {/* 按钮光晕效果 */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-600 via-purple-600 to-pink-600 opacity-0 blur transition-opacity group-hover/btn:opacity-100" />
            </Button>
          </form>

          {/* 分隔�?*/}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="text-xs text-slate-500">测试账号</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          {/* 测试账号信息 */}
          <div className="space-y-2 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">管理�?/span>
              <code className="rounded bg-white/10 px-2 py-1 font-mono text-xs text-orange-300">
                admin / 123456
              </code>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">测试账号</span>
              <code className="rounded bg-white/10 px-2 py-1 font-mono text-xs text-purple-300">
                test / 123456
              </code>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Powered by{' '}
              <span className="bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text font-semibold text-transparent">
                FastAPI + React + Shadcn UI
              </span>
            </p>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            还没有账号？{' '}
            <button className="font-medium text-orange-400 transition-colors hover:text-orange-300">
              立即注册
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
