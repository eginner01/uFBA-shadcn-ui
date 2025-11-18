import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Shield, User, ArrowLeft, CheckCircle2, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function GmailAuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // 检测是从登录还是注册页面来的
  const fromRegister = document.referrer.includes('/register');
  const actionText = fromRegister ? '注册' : '登录';

  const handleAuthorize = async () => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: '授权成功',
        description: '正在跳转到系统...',
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }, 1500);
  };

  const permissions = [
    { icon: User, label: '基本资料', desc: '姓名、头像等 Google 账号信息' },
    { icon: Mail, label: '电子邮件', desc: '您的 Gmail 邮箱地址' },
    { icon: Calendar, label: '日历访问', desc: '查看和管理您的日历事件' },
    { icon: Shield, label: '身份验证', desc: '验证您的 Google 账号身份' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4 animate-in fade-in duration-700">
        <Card className="border-border bg-card/50 backdrop-blur-xl shadow-2xl animate-in zoom-in duration-500">
          <CardHeader className="space-y-3 pb-4 pt-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EA4335] via-[#FBBC05] to-[#34A853] flex items-center justify-center shadow-lg">
                <Mail className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl text-center text-foreground font-semibold">
              Google 授权{actionText}
            </CardTitle>
            <CardDescription className="text-center text-xs">
              使用 Google 账号快速{actionText}到 uFBA-shadcn/ui
            </CardDescription>
          </CardHeader>
      
          <CardContent className="space-y-5 pb-6">
            {/* 授权说明 */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Google 安全认证</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    通过 Google OAuth 2.0 安全登录，保护您的账号安全
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* 权限列表 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">此应用将获得以下权限：</h3>
              <div className="space-y-2">
                {permissions.map((perm, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EA4335]/10 to-[#34A853]/10 flex items-center justify-center flex-shrink-0">
                      <perm.icon className="w-4 h-4 text-[#EA4335]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{perm.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{perm.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* 操作按钮 */}
            <div className="space-y-2">
              <Button
                onClick={handleAuthorize}
                disabled={loading}
                className="w-full bg-[#4285F4] hover:bg-[#357ae8] text-white h-10 text-sm"
              >
                {loading ? '授权中...' : `使用 Google ${actionText}`}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full h-10 text-sm border-border"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回登录
              </Button>
            </div>

            {/* 底部说明 */}
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                {fromRegister 
                  ? '授权后将自动创建账号，您可随时管理授权权限' 
                  : '授权即表示您同意我们访问上述信息'
                }
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
