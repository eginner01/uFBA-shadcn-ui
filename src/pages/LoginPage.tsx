import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCw, KeyRound, Mail, User, Shield, Github, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // 表单状态
  const [selectAccount, setSelectAccount] = useState('admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [captcha, setCaptcha] = useState('');
  const [captchaUuid, setCaptchaUuid] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  // 获取验证码
  const fetchCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      const response = await fetch('/api/v1/auth/captcha');
      const result = await response.json();
      
      // 检查响应格式
      if (result.code === 200 && result.data) {
        setCaptchaUuid(result.data.uuid);
        setCaptchaImage(`data:image/png;base64,${result.data.image}`);
      } else if (result.uuid && result.image) {
        // 直接返回数据的情况
        setCaptchaUuid(result.uuid);
        setCaptchaImage(`data:image/png;base64,${result.image}`);
      } else {
        throw new Error('验证码数据格式错误');
      }
    } catch (error) {
      console.error('获取验证码失败', error);
      // 降级处理：生成一个模拟验证码
      const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      const svg = `
        <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#2d2d2d"/>
          <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#999" 
                text-anchor="middle" dy=".3em" font-weight="bold">${randomCode}</text>
        </svg>
      `;
      setCaptchaImage(`data:image/svg+xml;base64,${btoa(svg)}`);
      setCaptchaUuid('mock-uuid-' + Date.now());
      
      toast({
        title: '提示',
        description: '验证码服务暂不可用，显示模拟验证码',
        variant: 'destructive',
      });
    } finally {
      setCaptchaLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  // 账号切换
  const handleAccountChange = (value: string) => {
    setSelectAccount(value);
    setUsername(value);
    setPassword('123456');
  };

  // 登录提交
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!username) {
      toast({ title: '错误', description: '请输入用户名', variant: 'destructive' });
      return;
    }
    if (!password) {
      toast({ title: '错误', description: '请输入密码', variant: 'destructive' });
      return;
    }
    if (!captcha || captcha.length !== 4) {
      toast({ title: '错误', description: '请输入4位验证码', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // 1. 调用登录API（使用封装的axios client）
      const loginResponse: any = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          captcha,
          uuid: captchaUuid,
        }),
      });

      const loginData = await loginResponse.json();
      console.log('登录响应:', loginData);

      if (loginData.code === 200 && loginData.data) {
        const { access_token, session_uuid } = loginData.data;
        
        // 2. 保存 token 和 session_uuid
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('session_uuid', session_uuid);
        
        console.log('Token已保存:', access_token);

        // 3. 并行获取用户信息和权限代码
        try {
          const [userInfoResponse, accessCodesResponse] = await Promise.all([
            fetch('/api/v1/sys/users/me', {
              headers: { 'Authorization': `Bearer ${access_token}` }
            }),
            fetch('/api/v1/auth/codes', {
              headers: { 'Authorization': `Bearer ${access_token}` }
            })
          ]);

          const userInfo = await userInfoResponse.json();
          const accessCodes = await accessCodesResponse.json();

          console.log('用户信息:', userInfo);
          console.log('权限代码:', accessCodes);

          // 4. 保存用户信息和权限到 localStorage（临时方案）
          localStorage.setItem('user_info', JSON.stringify(userInfo));
          localStorage.setItem('access_codes', JSON.stringify(accessCodes));
          
          toast({
            title: '登录成功',
            description: `欢迎回来，${userInfo.data?.nickname || username}`,
          });

          // 5. 显示成功动画后跳转
          setIsSuccess(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 800);
        } catch (error) {
          console.error('获取用户信息失败:', error);
          // 即使获取用户信息失败，也允许登录
          toast({
            title: '登录成功',
            description: `欢迎回来，${username}`,
          });
          setIsSuccess(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 800);
        }
      } else {
        toast({
          title: '登录失败',
          description: loginData.msg || '用户名或密码错误',
          variant: 'destructive',
        });
        // 刷新验证码
        fetchCaptcha();
        setCaptcha('');
      }
    } catch (error) {
      console.error('登录错误:', error);
      toast({
        title: '登录失败',
        description: '网络错误，请稍后重试',
        variant: 'destructive',
      });
      fetchCaptcha();
      setCaptcha('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12 transition-opacity duration-500 ${isSuccess ? 'opacity-0' : 'opacity-100'}`}>
      {/* 背景装饰层 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
      
      {/* 模糊装饰圆 */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 animate-in fade-in duration-700">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* 左侧：品牌展示 */}
          <div className="hidden lg:block space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">企业级管理平台</span>
              </div>
              
              <h1 className="text-5xl font-bold text-foreground tracking-tight">
                uFBA
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  shadcn/ui
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                基于 FastAPI 和 shadcn/ui 构建的现代化企业级管理平台，
                提供完整的后台管理解决方案。
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: '安全可靠', desc: '企业级安全防护' },
                { icon: User, label: '易于管理', desc: '直观的操作界面' },
                { icon: KeyRound, label: '权限控制', desc: '精细化权限管理' },
                { icon: Mail, label: '实时通知', desc: '多渠道消息推送' },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-lg transition-all">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{feature.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：登录表单 */}
          <Card className="border-border bg-card/50 backdrop-blur-xl shadow-2xl animate-in slide-in-from-right duration-700">
            <CardHeader className="space-y-1 pb-4 pt-6">
              <div className="flex items-center justify-center mb-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-bold text-xl">U</span>
                </div>
              </div>
              <CardTitle className="text-xl text-center text-foreground font-semibold">
                欢迎回来
              </CardTitle>
              <CardDescription className="text-center text-xs">
                请登录以继续使用系统
              </CardDescription>
            </CardHeader>
        
            <CardContent className="space-y-4 pb-6">
              <form onSubmit={handleLogin} className="space-y-3">
                {/* 选择账号类型 */}
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs">
                    账号类型
                  </Label>
                  <Select value={selectAccount} onValueChange={handleAccountChange}>
                    <SelectTrigger className="bg-input border-border text-foreground h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="admin" className="text-foreground">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          <span>Admin - 管理员（全部权限）</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="test" className="text-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>Test - 测试用户（受限权限）</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 用户名 */}
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs">用户名</Label>
                  <Input
                    type="text"
                    placeholder="请输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-10 text-sm"
                    disabled={loading}
                  />
                </div>

                {/* 密码 */}
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs">密码</Label>
                  <Input
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-10 text-sm"
                    disabled={loading}
                  />
                </div>

                {/* 验证码 */}
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs">验证码</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="请输入验证码"
                      value={captcha}
                      onChange={(e) => setCaptcha(e.target.value.toUpperCase())}
                      maxLength={4}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-10 flex-1 text-sm"
                      disabled={loading}
                    />
                    <div className="relative w-[100px] h-10 flex-shrink-0">
                      {captchaLoading ? (
                        <div className="w-full h-full bg-muted border border-border rounded-md flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        </div>
                      ) : captchaImage ? (
                        <div 
                          className="relative group cursor-pointer w-full h-full" 
                          onClick={fetchCaptcha}
                          title="点击刷新验证码"
                        >
                          <img
                            src={captchaImage}
                            alt="验证码"
                            className="w-full h-full object-contain rounded-md border border-border bg-muted group-hover:opacity-80 transition"
                            onError={(e) => {
                              console.error('验证码图片加载失败');
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMyZDJkMmQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition rounded-md">
                            <RefreshCw className="w-5 h-5 text-foreground opacity-0 group-hover:opacity-100 transition" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-muted border border-border rounded-md flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">暂无验证码</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 登录按钮 */}
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-10 shadow-lg text-sm mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      登录中...
                    </>
                  ) : (
                    '登 录'
                  )}
                </Button>
              </form>

              <div className="relative">
                <Separator />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3">
                  <span className="text-xs text-muted-foreground">或使用第三方账号登录</span>
                </div>
              </div>

              {/* 第三方登录 */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 border-border hover:bg-accent"
                  onClick={() => navigate('/auth/github')}
                >
                  <Github className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 border-border hover:bg-accent"
                  onClick={() => navigate('/auth/gmail')}
                >
                  <Mail className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 border-border hover:bg-accent"
                  onClick={() => navigate('/auth/linuxdo')}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                </Button>
              </div>

              <Separator />

              {/* 注册入口 */}
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  还没有账号？
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="ml-2 text-primary hover:underline font-medium"
                  >
                    立即注册
                  </button>
                </p>
                <p className="text-xs text-muted-foreground">
                  登录即表示您同意我们的服务条款和隐私政策
                </p>
                <p className="text-xs text-muted-foreground">
                  © 2024 uFBA-shadcn/ui. All rights reserved.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
