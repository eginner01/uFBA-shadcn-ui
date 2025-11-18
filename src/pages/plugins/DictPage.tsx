import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { 
  getDictTypeListApi,
  createDictTypeApi,
  updateDictTypeApi,
  deleteDictTypeApi,
  getDictDataListApi,
  createDictDataApi,
  updateDictDataApi,
  deleteDictDataApi,
  type DictTypeResult,
  type CreateDictTypeParams,
  type DictDataResult,
  type CreateDictDataParams
} from '@/api/dict';

export default function DictPage() {
  const { toast } = useToast();
  const { confirm } = useConfirmDialog();

  // 字典类型相关状态
  const [dictTypes, setDictTypes] = useState<DictTypeResult[]>([]);
  const [selectedType, setSelectedType] = useState<DictTypeResult | null>(null);
  const [typeLoading, setTypeLoading] = useState(false);
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [currentType, setCurrentType] = useState<Partial<DictTypeResult>>({});
  const [typeSearchParams, setTypeSearchParams] = useState({ name: '', code: '' });

  // 字典数据相关状态
  const [dictData, setDictData] = useState<DictDataResult[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataDialogOpen, setDataDialogOpen] = useState(false);
  const [currentData, setCurrentData] = useState<Partial<DictDataResult>>({});
  const [dataSearchParams, setDataSearchParams] = useState({ label: '' });

  // 加载字典类型
  const fetchDictTypes = async () => {
    setTypeLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(typeSearchParams).filter(([_, value]) => value !== '' && value !== undefined)
      );
      const response = await getDictTypeListApi(filteredParams);
      setDictTypes(response?.items || []);
    } catch (error) {
      toast({ title: "错误", description: "获取字典类型失败", variant: "destructive" });
    } finally {
      setTypeLoading(false);
    }
  };

  // 加载字典数据
  const fetchDictData = async () => {
    if (!selectedType) {
      setDictData([]);
      return;
    }
    setDataLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries({
          type_id: selectedType.id,
          label: dataSearchParams.label,
        }).filter(([_, value]) => value !== '' && value !== undefined)
      );
      const response = await getDictDataListApi(filteredParams);
      setDictData(response?.items || []);
    } catch (error) {
      toast({ title: "错误", description: "获取字典数据失败", variant: "destructive" });
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchDictTypes();
  }, []);

  useEffect(() => {
    fetchDictData();
  }, [selectedType]);

  // 字典类型操作
  const handleTypeAdd = () => {
    setCurrentType({ status: 1 });
    setTypeDialogOpen(true);
  };

  const handleTypeEdit = (type: DictTypeResult) => {
    setCurrentType(type);
    setTypeDialogOpen(true);
  };

  const handleTypeSave = async () => {
    if (!currentType.name?.trim() || !currentType.code?.trim()) {
      toast({ title: "错误", description: "请填写名称和编码", variant: "destructive" });
      return;
    }
    try {
      const data: CreateDictTypeParams = {
        name: currentType.name!,
        code: currentType.code!,
        status: currentType.status ?? 1,
        remark: currentType.remark || '',
      };
      if (currentType.id) {
        await updateDictTypeApi(currentType.id, data);
        toast({ title: "成功", description: "更新成功" });
      } else {
        await createDictTypeApi(data);
        toast({ title: "成功", description: "创建成功" });
      }
      setTypeDialogOpen(false);
      fetchDictTypes();
    } catch (error) {
      toast({ title: "错误", description: "保存失败", variant: "destructive" });
    }
  };

  const handleTypeDelete = async (id: number, name: string) => {
    const confirmed = await confirm({
      title: '删除字典类型',
      description: `确认删除字典类型「${name}」？`,
      confirmText: '删除',
      type: 'error',
    });
    if (!confirmed) return;
    try {
      await deleteDictTypeApi([id]);
      toast({ title: "成功", description: "删除成功" });
      if (selectedType?.id === id) setSelectedType(null);
      fetchDictTypes();
    } catch (error) {
      toast({ title: "错误", description: "删除失败", variant: "destructive" });
    }
  };

  // 字典数据操作
  const handleDataAdd = () => {
    if (!selectedType) {
      toast({ title: "提示", description: "请先选择字典类型" });
      return;
    }
    setCurrentData({ type_id: selectedType.id, status: 1, sort: 0 });
    setDataDialogOpen(true);
  };

  const handleDataEdit = (data: DictDataResult) => {
    setCurrentData(data);
    setDataDialogOpen(true);
  };

  const handleDataSave = async () => {
    if (!currentData.label?.trim() || !currentData.value?.trim()) {
      toast({ title: "错误", description: "请填写标签和值", variant: "destructive" });
      return;
    }
    try {
      const data: CreateDictDataParams = {
        type_id: currentData.type_id!,
        label: currentData.label!,
        value: currentData.value!,
        sort: currentData.sort ?? 0,
        status: currentData.status ?? 1,
        remark: currentData.remark || '',
      };
      if (currentData.id) {
        await updateDictDataApi(currentData.id, data);
        toast({ title: "成功", description: "更新成功" });
      } else {
        await createDictDataApi(data);
        toast({ title: "成功", description: "创建成功" });
      }
      setDataDialogOpen(false);
      fetchDictData();
    } catch (error) {
      toast({ title: "错误", description: "保存失败", variant: "destructive" });
    }
  };

  const handleDataDelete = async (id: number, label: string) => {
    const confirmed = await confirm({
      title: '删除字典数据',
      description: `确认删除字典数据「${label}」？`,
      confirmText: '删除',
      type: 'error',
    });
    if (!confirmed) return;
    try {
      await deleteDictDataApi([id]);
      toast({ title: "成功", description: "删除成功" });
      fetchDictData();
    } catch (error) {
      toast({ title: "错误", description: "删除失败", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: number) => {
    return status === 1
      ? <Badge className="bg-green-500/10 text-green-500 border-green-500/20">正常</Badge>
      : <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">停用</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">字典管理</h1>
          <p className="text-muted-foreground text-sm mt-1">系统字典数据管理</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* 左侧：字典类型 */}
        <Card className="col-span-5 border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">字典类型</h2>
              <Button onClick={handleTypeAdd} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" />
                新增
              </Button>
            </div>

            {/* 搜索 */}
            <div className="space-y-2 mb-4">
              <Input
                placeholder="搜索名称"
                value={typeSearchParams.name}
                onChange={(e) => setTypeSearchParams(prev => ({ ...prev, name: e.target.value }))}
                className="bg-input border-border text-foreground text-sm"
              />
              <Input
                placeholder="搜索编码"
                value={typeSearchParams.code}
                onChange={(e) => setTypeSearchParams(prev => ({ ...prev, code: e.target.value }))}
                className="bg-input border-border text-foreground text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={fetchDictTypes} size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                  查询
                </Button>
                <Button 
                  onClick={() => { setTypeSearchParams({ name: '', code: '' }); setTimeout(fetchDictTypes, 0); }} 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-border text-xs"
                >
                  重置
                </Button>
              </div>
            </div>

            {/* 列表 */}
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="text-xs">名称</TableHead>
                    <TableHead className="text-xs">编码</TableHead>
                    <TableHead className="text-xs w-20">状态</TableHead>
                    <TableHead className="text-xs w-20 text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typeLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                        加载中...
                      </TableCell>
                    </TableRow>
                  ) : dictTypes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                        暂无数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    dictTypes.map((type) => (
                      <TableRow 
                        key={type.id} 
                        className={`border-border cursor-pointer ${selectedType?.id === type.id ? 'bg-accent' : 'hover:bg-accent/50'}`}
                        onClick={() => setSelectedType(type)}
                      >
                        <TableCell className="text-sm text-foreground">{type.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground font-mono">{type.code}</TableCell>
                        <TableCell className="text-sm">{getStatusBadge(type.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleTypeEdit(type); }}
                              className="text-muted-foreground hover:text-foreground hover:bg-accent h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleTypeDelete(type.id, type.name); }}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
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

        {/* 右侧：字典数据 */}
        <Card className="col-span-7 border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                字典数据
                {selectedType && <span className="text-sm text-muted-foreground ml-2">({selectedType.name})</span>}
              </h2>
              <Button onClick={handleDataAdd} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={!selectedType}>
                <Plus className="w-4 h-4 mr-1" />
                新增
              </Button>
            </div>

            {/* 搜索 */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="搜索标签"
                value={dataSearchParams.label}
                onChange={(e) => setDataSearchParams({ label: e.target.value })}
                className="bg-input border-border text-foreground text-sm flex-1"
              />
              <Button onClick={fetchDictData} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                查询
              </Button>
              <Button 
                onClick={() => { setDataSearchParams({ label: '' }); setTimeout(fetchDictData, 0); }} 
                size="sm" 
                variant="outline" 
                className="border-border text-xs"
              >
                重置
              </Button>
            </div>

            {/* 列表 */}
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="text-xs">标签</TableHead>
                    <TableHead className="text-xs">值</TableHead>
                    <TableHead className="text-xs w-16">排序</TableHead>
                    <TableHead className="text-xs w-20">状态</TableHead>
                    <TableHead className="text-xs w-24 text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedType ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                        请先选择字典类型
                      </TableCell>
                    </TableRow>
                  ) : dataLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                        加载中...
                      </TableCell>
                    </TableRow>
                  ) : dictData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                        暂无数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    dictData.map((data) => (
                      <TableRow key={data.id} className="border-border hover:bg-accent/50">
                        <TableCell className="text-sm text-foreground">{data.label}</TableCell>
                        <TableCell className="text-sm text-muted-foreground font-mono">{data.value}</TableCell>
                        <TableCell className="text-sm text-muted-foreground text-center">{data.sort}</TableCell>
                        <TableCell className="text-sm">{getStatusBadge(data.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDataEdit(data)}
                              className="text-muted-foreground hover:text-foreground hover:bg-accent h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDataDelete(data.id, data.label)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
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
      </div>

      {/* 字典类型对话框 */}
      <Dialog open={typeDialogOpen} onOpenChange={setTypeDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {currentType.id ? '编辑字典类型' : '新增字典类型'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-muted-foreground text-sm">名称 <span className="text-destructive">*</span></Label>
              <Input
                value={currentType.name || ''}
                onChange={(e) => setCurrentType(prev => ({ ...prev, name: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入名称"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">编码 <span className="text-destructive">*</span></Label>
              <Input
                value={currentType.code || ''}
                onChange={(e) => setCurrentType(prev => ({ ...prev, code: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入编码"
                disabled={!!currentType.id}
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">状态 <span className="text-destructive">*</span></Label>
              <RadioGroup 
                value={currentType.status?.toString() || '1'}
                onValueChange={(value: string) => setCurrentType(prev => ({ ...prev, status: Number(value) }))}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="type-status-1" />
                  <Label htmlFor="type-status-1" className="cursor-pointer font-normal text-sm">正常</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="type-status-0" />
                  <Label htmlFor="type-status-0" className="cursor-pointer font-normal text-sm">停用</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">备注</Label>
              <Input
                value={currentType.remark || ''}
                onChange={(e) => setCurrentType(prev => ({ ...prev, remark: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入备注"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTypeDialogOpen(false)} className="border-border text-sm">取消</Button>
            <Button onClick={handleTypeSave} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 字典数据对话框 */}
      <Dialog open={dataDialogOpen} onOpenChange={setDataDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {currentData.id ? '编辑字典数据' : '新增字典数据'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-muted-foreground text-sm">标签 <span className="text-destructive">*</span></Label>
              <Input
                value={currentData.label || ''}
                onChange={(e) => setCurrentData(prev => ({ ...prev, label: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入标签"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">值 <span className="text-destructive">*</span></Label>
              <Input
                value={currentData.value || ''}
                onChange={(e) => setCurrentData(prev => ({ ...prev, value: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入值"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">排序</Label>
              <Input
                type="number"
                value={currentData.sort ?? 0}
                onChange={(e) => setCurrentData(prev => ({ ...prev, sort: Number(e.target.value) }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="数字越小越靠前"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">状态 <span className="text-destructive">*</span></Label>
              <RadioGroup 
                value={currentData.status?.toString() || '1'}
                onValueChange={(value: string) => setCurrentData(prev => ({ ...prev, status: Number(value) }))}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="data-status-1" />
                  <Label htmlFor="data-status-1" className="cursor-pointer font-normal text-sm">正常</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="data-status-0" />
                  <Label htmlFor="data-status-0" className="cursor-pointer font-normal text-sm">停用</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">备注</Label>
              <Input
                value={currentData.remark || ''}
                onChange={(e) => setCurrentData(prev => ({ ...prev, remark: e.target.value }))}
                className="bg-input border-border text-foreground mt-2 text-sm"
                placeholder="请输入备注"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDataDialogOpen(false)} className="border-border text-sm">取消</Button>
            <Button onClick={handleDataSave} className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
