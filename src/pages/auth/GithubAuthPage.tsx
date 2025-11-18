import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, Shield, User, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function GithubAuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // 检测是从登录还是注册页面来的
  const fromRegister = document.referrer.includes('/register');
  const actionText = fromRegister ? '注册' : '登录';

  const handleAuthorize = async () => {
    setLoading(true);
    // 模拟授权流程
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
    { icon: User, label: '基本信息', desc: '获取您的用户名、头像等公开信息' },
    { icon: Mail, label: '邮箱地址', desc: '用于账号绑定和通知' },
    { icon: Shield, label: '账号权限', desc: '验证您的GitHub账号身份' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4 animate-in fade-in duration-700">
        <Card className="border-border bg-card/50 backdrop-blur-xl shadow-2xl animate-in zoom-in duration-500">
          <CardHeader className="space-y-3 pb-4 pt-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#24292e] flex items-center justify-center shadow-lg">
                <Github className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl text-center text-foreground font-semibold">
              GitHub 授权{actionText}
            </CardTitle>
            <CardDescription className="text-center text-xs">
              使用 GitHub 账号快速{actionText}到 uFBA-shadcn/ui
            </CardDescription>
          </CardHeader>
      
          <CardContent className="space-y-5 pb-6">
            {/* 授权说明 */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">安全可靠</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    使用 OAuth 2.0 标准协议，不会获取您的密码
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
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <perm.icon className="w-4 h-4 text-primary" />
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
                className="w-full bg-[#24292e] hover:bg-[#1a1e22] text-white h-10 text-sm"
              >
                {loading ? '授权中...' : `授权并${actionText}`}
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
                  ? '授权后将自动创建账号并绑定您的 GitHub 身份' 
                  : '授权后，我们将根据您的 GitHub 信息创建或关联账号'
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
