import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('website');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">参数设置</h1>
          <p className="text-muted-foreground text-sm mt-1">系统参数配置管理</p>
        </div>
        <Button variant="outline" className="border-border hover:bg-accent text-sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新
        </Button>
      </div>

      <Card className="border-border bg-card min-h-[calc(100vh-200px)]">
        <CardContent className="p-6 h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="website" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">网站配置</TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">安全配置</TabsTrigger>
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">登录配置</TabsTrigger>
              <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">邮件配置</TabsTrigger>
            </TabsList>
            <TabsContent value="website" className="mt-6">
              <div className="text-center py-12 text-muted-foreground text-sm">
                <p>网站配置（功能开发中）</p>
              </div>
            </TabsContent>
            <TabsContent value="security" className="mt-6">
              <div className="text-center py-12 text-muted-foreground text-sm">
                <p>安全配置（功能开发中）</p>
              </div>
            </TabsContent>
            <TabsContent value="login" className="mt-6">
              <div className="text-center py-12 text-muted-foreground text-sm">
                <p>登录配置（功能开发中）</p>
              </div>
            </TabsContent>
            <TabsContent value="email" className="mt-6">
              <div className="text-center py-12 text-muted-foreground text-sm">
                <p>邮件配置（功能开发中）</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
