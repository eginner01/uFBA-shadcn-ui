import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Shield } from 'lucide-react';

export default function ChatGPTStyleLogin() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert(`继续登录: ${email}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-semibold text-gray-900">FastAPI Admin</span>
      </div>

      {/* 主要内容 */}
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-3xl font-semibold text-gray-900">
          欢迎回来
        </h1>
        <p className="mb-8 text-center text-sm text-gray-600">
          登录到您的账户以继续
        </p>

        {/* 登录表单 */}
        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-md border-gray-300 px-4 text-base focus:border-black focus:ring-1 focus:ring-black"
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-md bg-black text-base font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? '处理�?..' : '继续'}
          </Button>
        </form>

        {/* 分隔�?*/}
        <div className="my-6 flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs text-gray-500">�?/span>
          <Separator className="flex-1" />
        </div>

        {/* 其他登录方式 */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full rounded-md border-gray-300 text-base font-normal hover:bg-gray-50"
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            使用 Google 登录
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-12 w-full rounded-md border-gray-300 text-base font-normal hover:bg-gray-50"
          >
            <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            使用 GitHub 登录
          </Button>
        </div>

        {/* 底部链接 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            还没有账户？
            <button className="ml-1 font-medium text-black hover:underline">
              注册
            </button>
          </p>
        </div>

        {/* 测试提示 */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-600">
            测试账号: <span className="font-mono text-black">admin@example.com</span>
          </p>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="mt-12 text-center">
        <p className="text-xs text-gray-500">
          © 2024 FastAPI Admin · 
          <button className="ml-1 hover:underline">服务条款</button> · 
          <button className="ml-1 hover:underline">隐私政策</button>
        </p>
      </div>
    </div>
  );
}
