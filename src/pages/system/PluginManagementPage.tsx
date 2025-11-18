import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Plus, Download, Trash2, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import {
  getPluginListApi,
  getPluginChangedApi,
  installZipPluginApi,
  installGitPluginApi,
  updatePluginStatusApi,
  downloadPluginApi,
  uninstallPluginApi
} from '@/api/plugin';

interface PluginInfo {
  plugin: {
    name: string;
    summary: string;
    author: string;
    description: string;
    version: string;
    enable: string;
  };
}

export default function PluginManagementPage() {
  const { toast } = useToast();
  const { confirm } = useConfirmDialog();
  const [pluginInfo, setPluginInfo] = useState<PluginInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [pluginChanged, setPluginChanged] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [installType, setInstallType] = useState(0); // 0: ZIP, 1: GIT
  const [repoUrl, setRepoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchPluginChanged = async () => {
    try {
      const changed: any = await getPluginChangedApi();
      setPluginChanged(typeof changed === 'boolean' ? changed : changed?.data === true);
    } catch (error) {
      console.error('获取插件变更状态失败:', error);
    }
  };

  const fetchPlugin = async () => {
    setLoading(true);
    try {
      const plugins: any = await getPluginListApi();
      const pluginList = Array.isArray(plugins) ? plugins : plugins?.data || [];
      setPluginInfo(pluginList);
    } catch (error) {
      console.error('获取插件列表失败:', error);
      toast({ title: "错误", description: "获取插件列表失败", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPluginChanged();
    fetchPlugin();
  }, []);

  const handleInstall = () => {
    setRepoUrl('');
    setSelectedFile(null);
    setInstallType(0);
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitInstall = async () => {
    try {
      if (installType === 0) {
        if (!selectedFile) {
          toast({ title: "错误", description: "请选择要上传的ZIP文件", variant: "destructive" });
          return;
        }
        await installZipPluginApi(selectedFile);
      } else {
        if (!repoUrl) {
          toast({ title: "错误", description: "请输入Git仓库URL", variant: "destructive" });
          return;
        }
        await installGitPluginApi(repoUrl);
      }
      toast({ title: "成功", description: "插件安装成功" });
      setIsDialogOpen(false);
      setSelectedFile(null);
      setRepoUrl('');
      await fetchPlugin();
      await fetchPluginChanged();
    } catch (error) {
      console.error('安装插件失败:', error);
      toast({ title: "错误", description: "安装插件失败", variant: "destructive" });
    }
  };

  const handleToggleStatus = async (pluginName: string, currentEnable: string) => {
    try {
      await updatePluginStatusApi(pluginName);
      // 立即更新本地状态
      setPluginInfo(prev => prev.map(info => 
        info.plugin.name === pluginName 
          ? { ...info, plugin: { ...info.plugin, enable: currentEnable === "1" ? "0" : "1" } }
          : info
      ));
      await fetchPluginChanged();
      toast({ 
        title: "成功", 
        description: `插件已${currentEnable === "1" ? "禁用" : "启用"}` 
      });
    } catch (error) {
      console.error('更新插件状态失败:', error);
      toast({ title: "错误", description: "更新插件状态失败", variant: "destructive" });
      // 失败时重新获取列表恢复状态
      await fetchPlugin();
    }
  };

  const handleDownload = async (pluginName: string) => {
    const confirmed = await confirm({
      title: '下载插件',
      description: `确认打包并下载插件 ${pluginName} 吗？`,
      confirmText: '下载',
      type: 'info',
    });
    if (!confirmed) return;
    try {
      const response: any = await downloadPluginApi(pluginName);
      const blob = response?.data || response;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pluginName}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: "成功", description: "下载插件成功" });
    } catch (error) {
      console.error('下载插件失败:', error);
      toast({ title: "错误", description: "下载插件失败", variant: "destructive" });
    }
  };

  const handleUninstall = async (pluginName: string) => {
    const confirmed = await confirm({
      title: '卸载插件',
      description: `确认卸载插件 ${pluginName} 吗？此操作不可恢复！`,
      confirmText: '卸载',
      type: 'error',
    });
    if (!confirmed) return;
    try {
      await uninstallPluginApi(pluginName);
      toast({ title: "成功", description: "删除插件成功" });
      await fetchPlugin();
      await fetchPluginChanged();
    } catch (error) {
      console.error('删除插件失败:', error);
      toast({ title: "错误", description: "删除插件失败", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 min-h-[calc(100vh-200px)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">插件管理</h1>
          <p className="text-muted-foreground text-sm mt-1">系统插件安装与管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { fetchPlugin(); fetchPluginChanged(); }} className="border-border hover:bg-accent text-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button onClick={handleInstall} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            安装插件
          </Button>
        </div>
      </div>

      {pluginChanged && (
        <Card className="border border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="p-4">
            <p className="text-yellow-400 text-sm">
              ⚠️ 检测到插件状态存在变更，为了确保系统能够正常运行，请尽快联系系统管理员进行相关调整
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="border-border bg-card min-h-[calc(100vh-200px)]">
        <CardContent className="p-6 h-full">
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="text-xs">插件名称</TableHead>
                  <TableHead className="text-xs">作者</TableHead>
                  <TableHead className="text-xs w-24">版本</TableHead>
                  <TableHead className="text-xs">描述</TableHead>
                  <TableHead className="text-xs w-32 text-center">状态</TableHead>
                  <TableHead className="text-xs w-32 text-center">运行状态</TableHead>
                  <TableHead className="text-xs w-40 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">加载中...</TableCell>
                  </TableRow>
                ) : pluginInfo.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <Package className="w-16 h-16 mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">暂无已安装插件</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pluginInfo.map((info) => (
                    <TableRow key={info.plugin.name} className="border-border">
                      <TableCell className="font-medium text-sm">
                        <div>
                          <div className="text-foreground">{info.plugin.summary}</div>
                          <div className="text-muted-foreground text-xs mt-0.5">{info.plugin.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">@{info.plugin.author}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {info.plugin.version}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-md">
                        <div className="line-clamp-2">{info.plugin.description}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch 
                            checked={info.plugin.enable === "1"}
                            onCheckedChange={() => handleToggleStatus(info.plugin.name, info.plugin.enable)}
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={info.plugin.enable === "1" ? "default" : "secondary"}
                          className={info.plugin.enable === "1" ? "bg-green-500/10 text-green-500 border-green-500/20 text-xs" : "bg-muted text-muted-foreground border-border text-xs"}
                        >
                          {info.plugin.enable === "1" ? '运行中' : '已停止'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDownload(info.plugin.name)} 
                            className="hover:bg-accent"
                            title="打包下载"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleUninstall(info.plugin.name)} 
                            className="hover:bg-accent text-destructive"
                            title="卸载插件"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">安装插件</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-muted-foreground text-sm">安装方式</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    value="0" 
                    checked={installType === 0} 
                    onChange={() => setInstallType(0)} 
                    className="mr-2" 
                  />
                  <span className="text-foreground">压缩包</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    value="1" 
                    checked={installType === 1} 
                    onChange={() => setInstallType(1)} 
                    className="mr-2" 
                  />
                  <span className="text-foreground">GIT</span>
                </label>
              </div>
            </div>
            
            {installType === 0 ? (
              <div>
                <Label className="text-muted-foreground text-sm">ZIP 压缩包</Label>
                <Input 
                  type="file" 
                  accept=".zip" 
                  onChange={handleFileChange} 
                  className="bg-input border-border text-foreground mt-2 text-sm" 
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-2">已选择: {selectedFile.name}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">仅能上传一个 zip 压缩包文件，重新上传则覆盖</p>
              </div>
            ) : (
              <div>
                <Label className="text-muted-foreground text-sm">GIT 地址</Label>
                <Input 
                  value={repoUrl} 
                  onChange={(e) => setRepoUrl(e.target.value)} 
                  placeholder="https://github.com/user/repo.git" 
                  className="bg-input border-border text-foreground mt-2 text-sm" 
                />
                <p className="text-xs text-muted-foreground mt-2">仓库内容无法实时检测，请谨慎操作，避免非插件代码植入</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border text-sm">取消</Button>
            <Button onClick={handleSubmitInstall} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">安装</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
