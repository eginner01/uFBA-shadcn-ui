import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getOnlineUsersApi } from '../api/monitor';

export default function TokenDebugPage() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLog(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[TokenDebug] ${message}`);
  };

  const checkToken = () => {
    addLog('=== 开始检查Token ===');
    const token = localStorage.getItem('access_token');
    const sessionUuid = localStorage.getItem('session_uuid');
    
    addLog(`Token存在: ${!!token}`);
    addLog(`Session UUID存在: ${!!sessionUuid}`);
    
    if (token) {
      addLog(`Token长度: ${token.length}`);
      addLog(`Token开�? ${token.substring(0, 50)}`);
      
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          addLog(`User ID: ${payload.sub}`);
          addLog(`Session UUID (token): ${payload.session_uuid}`);
          addLog(`Session UUID (storage): ${sessionUuid}`);
          addLog(`匹配: ${payload.session_uuid === sessionUuid ? '�? : '�?}`);
          addLog(`过期时间: ${new Date(payload.exp * 1000).toLocaleString()}`);
          addLog(`是否过期: ${payload.exp * 1000 < Date.now() ? '�?已过�? : '�?未过�?}`);
        } else {
          addLog(`�?Token格式错误 (parts: ${parts.length})`);
        }
      } catch (e: any) {
        addLog(`�?解析Token失败: ${e.message}`);
      }
    } else {
      addLog('�?Token不存在！');
    }
    
    addLog('=== 检查完�?===');
  };

  const testOnlineUsersAPI = async () => {
    addLog('=== 开始测试在线用户API ===');
    addLog('准备调用 getOnlineUsersApi()...');
    
    // 先显示当前token状�?
    const token = localStorage.getItem('access_token');
    addLog(`当前Token: ${token ? token.substring(0, 30) + '...' : 'null'}`);
    
    try {
      const result = await getOnlineUsersApi();
      addLog(`�?API调用成功！`);
      addLog(`返回数据: ${JSON.stringify(result).substring(0, 100)}...`);
      addLog(`在线用户�? ${result.length}`);
    } catch (error: any) {
      addLog(`�?API调用失败: ${error.message}`);
      addLog(`错误状态码: ${error.response?.status || 'N/A'}`);
      addLog(`错误响应: ${JSON.stringify(error.response?.data || {})}`);
      
      if (error.response?.status === 401) {
        addLog(`⚠️ 收到401未授权响应`);
        addLog(`这意味着后端认为token无效`);
        addLog(`请检查：`);
        addLog(`1. Token是否在Redis中`);
        addLog(`2. Token是否被后端正确解析`);
        addLog(`3. session_uuid是否匹配`);
      }
    }
    
    addLog('=== 测试完成 ===');
  };

  const clearLog = () => {
    setLog([]);
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Token调试页面</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 按钮�?*/}
          <div className="flex gap-2">
            <Button onClick={checkToken}>
              检查Token状�?
            </Button>
            <Button onClick={testOnlineUsersAPI} variant="secondary">
              测试在线用户API
            </Button>
            <Button onClick={clearLog} variant="outline">
              清空日志
            </Button>
          </div>

          {/* 日志显示 */}
          <div className="mt-4 p-4 bg-gray-900 text-green-400 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {log.length === 0 ? (
              <div className="text-gray-500">点击按钮开始测�?..</div>
            ) : (
              log.map((line, index) => (
                <div key={index} className="mb-1">
                  {line}
                </div>
              ))
            )}
          </div>

          {/* 说明 */}
          <div className="mt-4 p-4 bg-orange-50 rounded">
            <h3 className="font-bold mb-2">使用说明�?/h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>先点�?检查Token状�?，确认Token存在且有�?/li>
              <li>然后点击"测试在线用户API"，查看API是否成功调用</li>
              <li>查看日志输出，找出问题所�?/li>
              <li>同时打开浏览器Console查看详细的API Client日志</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
