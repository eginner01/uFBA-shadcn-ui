import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface ChartCPUUsageProps {
  usage: number;
  logicalNum: number;
  physicalNum: number;
  currentFreq: number;
}

export function ChartCPUUsage({ usage, logicalNum, physicalNum, currentFreq }: ChartCPUUsageProps) {
  // 生成模拟数据
  const data = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    usage: Math.max(0, Math.min(100, usage + (Math.random() - 0.5) * 10)),
  }));

  const chartConfig = {
    usage: {
      label: 'CPU使用�?,
      color: 'hsl(var(--chart-1))',
    },
  };

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'text-emerald-500';
    if (usage < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="border border-[#202020] bg-[#141414]">
      <CardHeader>
        <CardTitle className="text-white">CPU监控</CardTitle>
        <CardDescription className="text-gray-500">实时CPU使用情况</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-[#0f0f0f] rounded-lg">
            <div className="text-xs text-gray-500 mb-1">使用�?/div>
            <div className={`text-2xl font-bold ${getUsageColor(usage)}`}>
              {usage}%
            </div>
          </div>
          <div className="text-center p-3 bg-[#0f0f0f] rounded-lg">
            <div className="text-xs text-gray-500 mb-1">频率</div>
            <div className="text-2xl font-bold text-orange-400">
              {currentFreq}
              <span className="text-xs ml-1">MHz</span>
            </div>
          </div>
          <div className="text-center p-3 bg-[#0f0f0f] rounded-lg">
            <div className="text-xs text-gray-500 mb-1">逻辑核心</div>
            <div className="text-2xl font-bold text-purple-400">{logicalNum}</div>
          </div>
          <div className="text-center p-3 bg-[#0f0f0f] rounded-lg">
            <div className="text-xs text-gray-500 mb-1">物理核心</div>
            <div className="text-2xl font-bold text-cyan-400">{physicalNum}</div>
          </div>
        </div>
        
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#202020" />
            <XAxis dataKey="time" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 12 }} domain={[0, 100]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="usage"
              stroke="hsl(var(--chart-1))"
              fill="url(#fillUsage)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
