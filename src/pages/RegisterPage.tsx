import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, Mail, Phone, Github } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [phoneForm, setPhoneForm] = useState({ phone: '', code: '', password: '', confirmPassword: '' });
  const [emailForm, setEmailForm] = useState({ email: '', code: '', password: '', confirmPassword: '' });

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneForm.phone || !phoneForm.code || !phoneForm.password) {
      toast({ title: '错误', description: '请填写完整信息', variant: 'destructive' });
      return;
    }
    if (phoneForm.password !== phoneForm.confirmPassword) {
      toast({ title: '错误', description: '两次密码不一致', variant: 'destructive' });
      return;
    }
    toast({ title: '提示', description: '注册功能开发中' });
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.email || !emailForm.code || !emailForm.password) {
      toast({ title: '错误', description: '请填写完整信息', variant: 'destructive' });
      return;
    }
    if (emailForm.password !== emailForm.confirmPassword) {
      toast({ title: '错误', description: '两次密码不一致', variant: 'destructive' });
      return;
    }
    toast({ title: '提示', description: '注册功能开发中' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4 animate-in fade-in duration-700">
        <Card className="border-border bg-card/50 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom duration-700">
          <CardHeader className="space-y-1 pb-4 pt-6">
            <div className="flex items-center justify-center mb-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-xl">U</span>
              </div>
            </div>
            <CardTitle className="text-xl text-center text-foreground font-semibold">
              创建账号
            </CardTitle>
            <CardDescription className="text-center text-xs">
              选择注册方式开始使用
            </CardDescription>
          </CardHeader>
      
          <CardContent className="space-y-4 pb-6">
            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted h-9">
                <TabsTrigger value="phone" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                  <Phone className="w-3.5 h-3.5 mr-1.5" />
                  手机注册
                </TabsTrigger>
                <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                  <Mail className="w-3.5 h-3.5 mr-1.5" />
                  邮箱注册
                </TabsTrigger>
              </TabsList>

              {/* 手机注册 */}
              <TabsContent value="phone" className="space-y-3 mt-4">
                <form onSubmit={handlePhoneRegister} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs">手机号码</Label>
                    <Input
                      type="tel"
                      placeholder="请输入手机号"
                      value={phoneForm.phone}
                      onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                      className="bg-input border-border text-foreground h-10 text-sm"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs">验证码</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="请输入验证码"
                        value={phoneForm.code}
                        onChange={(e) => setPhoneForm({ ...phoneForm, code: e.target.value })}
                        className="bg-input border-border text-foreground h-10 text-sm flex-1"
                        disabled={loading}
                      />
                      <Button type="button" variant="outline" className="h-10 px-3 text-xs border-border">
                        发送验证码
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs">设置密码</Label>
                    <Input
                      type="password"
                      placeholder="至少6位字符"
                      value={phoneForm.password}
                      onChange={(e) => setPhoneForm({ ...phoneForm, password: e.target.value })}
                      className="bg-input border-border text-foreground h-10 text-sm"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs">确认密码</Label>
                    <Input
                      type="password"
                      placeholder="再次输入密码"
                      value={phoneForm.confirmPassword}
                      onChange={(e) => setPhoneForm({ ...phoneForm, confirmPassword: e.target.value })}
                      className="bg-input border-border text-foreground h-10 text-sm"
                      disabled={loading}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 text-sm mt-4" disabled={loading}>
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />注册中...</> : '立即注册'}
                  </Button>
                </form>
              </TabsContent>

              {/* 邮箱注册 */}
              <TabsContent value="email" className="space-y-3 mt-4">
                <form onSubmit={handleEmailRegister} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs">邮箱地址</Label>
                    <Input
                      type="email"
                      placeholder="请输入邮箱"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                      className="bg-input border-border text-foreground h-10 text-sm"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs">验证码</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="请输入验证码"
                        value={emailForm.code}
                        onChange={(e) => setEmailForm({ ...emailForm, code: e.target.value })}
                        className="bg-input border-border text-foreground h-10 text-sm flex-1"
                        disabled={loading}
                      />
                      <Button type="button" variant="outline" className="h-10 px-3 text-xs border-border">
                        发送验证码
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs">设置密码</Label>
                    <Input
                      type="password"
                      placeholder="至少6位字符"
                      value={emailForm.password}
                      onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                      className="bg-input border-border text-foreground h-10 text-sm"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs">确认密码</Label>
                    <Input
                      type="password"
                      placeholder="再次输入密码"
                      value={emailForm.confirmPassword}
                      onChange={(e) => setEmailForm({ ...emailForm, confirmPassword: e.target.value })}
                      className="bg-input border-border text-foreground h-10 text-sm"
                      disabled={loading}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 text-sm mt-4" disabled={loading}>
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />注册中...</> : '立即注册'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <Separator />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3">
                <span className="text-xs text-muted-foreground">或使用第三方账号</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button type="button" variant="outline" className="h-9 border-border hover:bg-accent" onClick={() => navigate('/auth/github')}>
                <Github className="w-4 h-4" />
              </Button>
              <Button type="button" variant="outline" className="h-9 border-border hover:bg-accent" onClick={() => navigate('/auth/gmail')}>
                <Mail className="w-4 h-4" />
              </Button>
              <Button type="button" variant="outline" className="h-9 border-border hover:bg-accent" onClick={() => navigate('/auth/linuxdo')}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </Button>
            </div>

            <Separator />

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                已有账号？
                <button type="button" onClick={() => navigate('/login')} className="ml-2 text-primary hover:underline font-medium">
                  立即登录
                </button>
              </p>
              <p className="text-xs text-muted-foreground">
                注册即表示您同意我们的服务条款和隐私政策
              </p>
              <p className="text-xs text-muted-foreground">
                © 2024 uFBA-shadcn/ui. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
