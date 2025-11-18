import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';

interface ChartMemoryUsageProps {
  total: number;
  used: number;
  free: number;
  usage: number;
}

export function ChartMemoryUsage({ total, used, free, usage }: ChartMemoryUsageProps) {
  const data = [
    { name: '已用', value: used, fill: 'hsl(var(--chart-2))' },
    { name: '空闲', value: free, fill: 'hsl(var(--chart-3))' },
  ];

  const chartConfig = {
    value: {
      label: '内存',
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
        <CardTitle className="text-white">内存监控</CardTitle>
        <CardDescription className="text-gray-500">当前内存使用情况</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-[#0f0f0f] rounded-lg">
            <div className="text-xs text-gray-500 mb-1">总内�?/div>
            <div className="text-2xl font-bold text-orange-400">
              {total}
              <span className="text-xs ml-1">GB</span>
            </div>
          </div>
          <div className="text-center p-3 bg-[#0f0f0f] rounded-lg">
            <div className="text-xs text-gray-500 mb-1">已用</div>
            <div className="text-2xl font-bold text-orange-400">
              {used}
              <span className="text-xs ml-1">GB</span>
            </div>
          </div>
          <div className="text-center p-3 bg-[#0f0f0f] rounded-lg">
            <div className="text-xs text-gray-500 mb-1">使用�?/div>
            <div className={`text-2xl font-bold ${getUsageColor(usage)}`}>
              {usage}%
            </div>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#202020" />
            <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
