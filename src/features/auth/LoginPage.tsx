import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Lock, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';
import { getCaptchaApi } from '@/api/auth';

// 表单验证 Schema
const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名').min(3, '用户名至�?个字�?),
  password: z.string().min(1, '请输入密�?).min(6, '密码至少6个字�?),
  captcha: z.string().min(1, '请输入验证码').length(4, '验证码为4�?),
  remember: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [captchaImg, setCaptchaImg] = useState('');
  const [captchaUuid, setCaptchaUuid] = useState('');

  // 表单
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: localStorage.getItem('remember_username') || '',
      password: '',
      captcha: '',
      remember: !!localStorage.getItem('remember_username'),
    },
  });

  // 获取验证�?
  const fetchCaptcha = async () => {
    try {
      const data = await getCaptchaApi();
      setCaptchaImg(data.image);
      setCaptchaUuid(data.uuid);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '获取验证码失�?,
        description: error.message || '请稍后重�?,
      });
    }
  };

  // 初始化获取验证码
  useEffect(() => {
    fetchCaptcha();
  }, []);

  // 登录提交
  const onSubmit = async (values: LoginForm) => {
    if (!captchaUuid) {
      toast({
        variant: 'destructive',
        title: '验证码未加载',
        description: '请刷新验证码后重�?,
      });
      return;
    }

    setLoading(true);

    try {
      // 调用登录 API
      await login(values.username, values.password, values.captcha, captchaUuid);

      // 记住用户�?
      if (values.remember) {
        localStorage.setItem('remember_username', values.username);
      } else {
        localStorage.removeItem('remember_username');
      }

      // 登录成功提示
      toast({
        title: '登录成功',
        description: '欢迎回来�?,
      });

      // 跳转到目标页面或首页
      const from = (location.state as any)?.from || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      // 登录失败
      toast({
        variant: 'destructive',
        title: '登录失败',
        description: error.message || '用户名或密码错误',
      });

      // 刷新验证�?
      fetchCaptcha();
      form.setValue('captcha', '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          {/* Logo */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>

          <CardTitle className="text-3xl font-bold tracking-tight">
            欢迎回来
          </CardTitle>
          <CardDescription>
            登录�?FastAPI Admin 管理系统
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* 用户�?*/}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户�?/FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="请输入用户名"
                          className="pl-10"
                          disabled={loading}
                          autoComplete="username"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 密码 */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="请输入密�?
                          className="pl-10"
                          disabled={loading}
                          autoComplete="current-password"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 验证�?*/}
              <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>验证�?/FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          {...field}
                          placeholder="请输入验证码"
                          className="flex-1"
                          disabled={loading}
                          maxLength={4}
                          autoComplete="off"
                        />
                        {captchaImg ? (
                          <div
                            className="flex h-10 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-input bg-card transition-all hover:border-primary"
                            onClick={fetchCaptcha}
                            title="点击刷新"
                          >
                            <img
                              src={captchaImg}
                              alt="验证�?
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-24 items-center justify-center rounded-md border border-input bg-muted">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 记住�?*/}
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer font-normal">
                      记住用户�?
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* 登录按钮 */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    登录�?..
                  </>
                ) : (
                  '登录'
                )}
              </Button>
            </form>
          </Form>

          {/* 提示信息 */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>默认管理员账号：admin / 123456</p>
            <p className="mt-1">测试账号：test / 123456</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
