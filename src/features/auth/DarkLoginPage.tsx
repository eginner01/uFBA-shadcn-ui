import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Shield, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCaptchaApi, loginApi } from '../../api/auth';
import { useAuthStore } from '../../store/auth';
import { useMenuStore } from '../../store/menu';

export default function DarkLoginPage() {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const { fetchMenus } = useMenuStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    selectAccount: 'admin',
    username: 'admin',
    password: '123456',
    captcha: '',
  });
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaUuid, setCaptchaUuid] = useState('');

  // 获取验证�?
  const refreshCaptcha = async () => {
    try {
      const response = await getCaptchaApi();
      if (response) {
        // response 已经�?CaptchaResult 类型
        setCaptchaImage(`data:image/png;base64,${response.image}`);
        setCaptchaUuid(response.uuid);
      }
    } catch (error) {
      console.error('获取验证码失�?', error);
      // 降级：使用占位图
      setCaptchaImage(`https://via.placeholder.com/120x40/1e293b/94a3b8?text=ABCD`);
    }
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  // 账号选择改变时自动填�?
  const handleAccountChange = (value: string) => {
    const accounts: Record<string, { username: string; password: string }> = {
      admin: { username: 'admin', password: '123456' },
      test: { username: 'test', password: '123456' },
    };
    
    setFormData({
      ...formData,
      selectAccount: value,
      username: accounts[value].username,
      password: accounts[value].password,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.captcha || formData.captcha.length !== 4) {
      alert('请输�?位验证码');
      return;
    }
    
    setLoading(true);
    
    try {
      // 调用登录API
      console.log('[Login] Calling login API...');
      const response = await loginApi({
        username: formData.username,
        password: formData.password,
        captcha: formData.captcha,
        uuid: captchaUuid,
      });
      
      console.log('[Login] Login response:', {
        access_token: response.access_token ? `${response.access_token.substring(0, 20)}...` : 'null',
        session_uuid: response.session_uuid,
      });
      
      // 保存token
      setToken(response.access_token, response.session_uuid);
      
      // 等待一下确保token已保�?
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('[Login] Fetching menus...');
      // 获取用户菜单（根据权限动态获取）
      await fetchMenus();
      
      console.log('[Login] Menus fetched successfully');
      
      // 跳转到仪表板
      navigate('/dashboard');
    } catch (error) {
      console.error('登录失败:', error);
      alert('登录失败，请检查账号密码和验证�?);
      refreshCaptcha(); // 刷新验证�?
      setFormData({ ...formData, captcha: '' }); // 清空验证�?
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-950">
      {/* 左侧 - 品牌展示�?*/}
      <div className="hidden w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 lg:flex lg:flex-col lg:justify-center lg:px-12">
        <div className="mx-auto max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/10 ring-2 ring-orange-500/50">
              <Shield className="h-12 w-12 text-orange-400" />
            </div>
          </div>
          
          <h1 className="mb-2 text-center text-4xl font-bold text-white">
            FastAPI Admin
          </h1>
          <p className="mb-12 text-center text-lg text-slate-400">
            企业级后台管理系�?
          </p>

          {/* 特性列�?*/}
          <div className="space-y-4">
            {[
              '安全可靠的权限控�?,
              '现代化的界面设计',
              '完善的数据管理功�?,
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-orange-400" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧 - 登录表单�?*/}
      <div className="flex w-full items-center justify-center bg-slate-900 px-8 lg:w-1/2 lg:px-16">
        <Card className="w-full max-w-md border-slate-800 bg-slate-800/50 backdrop-blur">
          <CardContent className="p-8">
            {/* 标题 */}
            <div className="mb-8 text-center">
              {/* 移动�?Logo */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-orange-500/10 ring-2 ring-orange-500/50 lg:hidden">
                <Shield className="h-8 w-8 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">欢迎回来</h2>
              <p className="mt-2 text-sm text-slate-400">
                登录�?FastAPI Admin 管理系统
              </p>
            </div>

            {/* 登录表单 */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 账号选择 */}
              <div className="space-y-2">
                <Label htmlFor="selectAccount" className="text-slate-300">
                  选择账号
                </Label>
                <Select
                  value={formData.selectAccount}
                  onValueChange={handleAccountChange}
                >
                  <SelectTrigger className="h-11 border-slate-700 bg-slate-900/50 text-white">
                    <SelectValue placeholder="选择账号" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-700 bg-slate-900">
                    <SelectItem value="admin" className="text-white">Admin</SelectItem>
                    <SelectItem value="test" className="text-white">Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 用户�?*/}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">
                  用户�?
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="h-11 border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500"
                  required
                  disabled={loading}
                />
              </div>

              {/* 密码 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300">
                    密码
                  </Label>
                  <button
                    type="button"
                    className="text-sm text-orange-400 hover:text-orange-300"
                  >
                    忘记密码�?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密�?
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-11 border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500"
                  required
                  disabled={loading}
                />
              </div>

              {/* 验证�?*/}
              <div className="space-y-2">
                <Label htmlFor="captcha" className="text-slate-300">
                  验证�?
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="captcha"
                    type="text"
                    placeholder="请输入验证码"
                    value={formData.captcha}
                    onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                    className="h-11 flex-1 border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-500"
                    maxLength={4}
                    required
                    disabled={loading}
                  />
                  <div className="relative h-11 w-[120px] overflow-hidden rounded-md border border-slate-700 bg-slate-900/50">
                    {captchaImage ? (
                      <img
                        src={captchaImage}
                        alt="验证�?
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-500">
                        加载�?..
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="absolute inset-0 flex items-center justify-center bg-slate-900/80 opacity-0 transition-opacity hover:opacity-100"
                    >
                      <RefreshCw className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 登录按钮 */}
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-orange-600 text-base font-medium hover:bg-orange-700"
              >
                {loading ? '登录�?..' : '登录'}
              </Button>

              {/* 分隔�?*/}
              <div className="relative my-6">
                <Separator className="bg-slate-700" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 px-2 text-sm text-slate-500">
                  或使用以下方式登�?
                </span>
              </div>

              {/* 第三方登�?*/}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 border-slate-700 bg-slate-900/50 hover:bg-slate-800"
                >
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                    />
                  </svg>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 border-slate-700 bg-slate-900/50 hover:bg-slate-800"
                >
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    />
                  </svg>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 border-slate-700 bg-slate-900/50 hover:bg-slate-800"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </Button>
              </div>

              {/* 注册链接 */}
              <div className="text-center text-sm text-slate-400">
                还没有账号？
                <button type="button" className="ml-1 font-medium text-orange-400 hover:text-orange-300">
                  立即注册
                </button>
              </div>
            </form>

            {/* 底部条款 */}
            <div className="mt-6 text-center text-xs text-slate-500">
              点击登录即表示您同意我们�?
              <button className="hover:text-slate-400">服务条款</button>
              �?
              <button className="hover:text-slate-400">隐私政策</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
