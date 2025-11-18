import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUserMenusApi, type SidebarMenu } from '../api/menu';

export default function MenuDebugPage() {
  const [menus, setMenus] = useState<SidebarMenu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserMenusApi();
      setMenus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取菜单失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const renderMenu = (menu: SidebarMenu, level = 0) => {
    return (
      <div key={menu.id} style={{ marginLeft: `${level * 20}px` }} className="my-2">
        <div className="p-2 border rounded">
          <div className="font-semibold">
            {menu.meta.title} ({menu.name})
          </div>
          <div className="text-sm text-muted-foreground">
            <div>ID: {menu.id}</div>
            <div>Path: {menu.path}</div>
            <div>Type: {menu.type}</div>
            <div>Parent ID: {menu.parent_id || 'null'}</div>
            <div>Has Children: {menu.children ? 'Yes' : 'No'}</div>
            <div>Children Count: {menu.children?.length || 0}</div>
          </div>
        </div>
        {menu.children && menu.children.length > 0 && (
          <div className="ml-4 mt-2">
            {menu.children.map(child => renderMenu(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>菜单调试工具</span>
            <Button onClick={fetchMenus} disabled={loading}>
              {loading ? '加载�?..' : '刷新菜单'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-500 mb-4 p-4 border border-red-300 rounded">
              错误: {error}
            </div>
          )}
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">统计信息</h3>
            <div className="text-sm">
              <div>总菜单数: {menus.length}</div>
              <div>
                有子菜单的项: {menus.filter(m => m.children && m.children.length > 0).length}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">数据权限菜单</h3>
            {(() => {
              const dataPermMenu = menus.find(
                m => m.path === '/system/data-permission' || 
                     m.meta.title === 'page.menu.sysDataPermission' ||
                     m.meta.title.includes('数据权限')
              );
              if (dataPermMenu) {
                return (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <div>找到数据权限菜单!</div>
                    <div>ID: {dataPermMenu.id}</div>
                    <div>标题: {dataPermMenu.meta.title}</div>
                    <div>路径: {dataPermMenu.path}</div>
                    <div>类型: {dataPermMenu.type}</div>
                    <div>子菜单数�? {dataPermMenu.children?.length || 0}</div>
                    {dataPermMenu.children && dataPermMenu.children.length > 0 ? (
                      <div className="mt-2">
                        <div className="font-semibold">子菜�?</div>
                        {dataPermMenu.children.map(child => (
                          <div key={child.id} className="ml-4 text-sm">
                            - {child.meta.title} ({child.path})
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-red-600 font-semibold">
                        ⚠️ 没有子菜单！这是问题所在�?
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="p-4 bg-red-50 border border-red-200 rounded">
                    未找到数据权限菜�?
                  </div>
                );
              }
            })()}
          </div>

          <div>
            <h3 className="font-semibold mb-2">完整菜单�?/h3>
            <div className="border rounded p-4 max-h-[600px] overflow-auto">
              {menus.map(menu => renderMenu(menu))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">原始JSON数据</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[400px] text-xs">
              {JSON.stringify(menus, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
