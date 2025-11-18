import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface ChartRedisStatsProps {
  totalCommands: number;
  keysNum: number;
  totalConnections: number;
}

export function ChartRedisStats({ totalCommands, keysNum, totalConnections }: ChartRedisStatsProps) {
  const data = [
    { name: '命令�?, value: totalCommands, fill: 'hsl(var(--chart-1))' },
    { name: '键数�?, value: keysNum, fill: 'hsl(var(--chart-2))' },
    { name: '连接�?, value: totalConnections, fill: 'hsl(var(--chart-3))' },
  ];

  const chartConfig = {
    value: {
      label: '数量',
    },
  };

  return (
    <Card className="border border-[#202020] bg-[#141414]">
      <CardHeader>
        <CardTitle className="text-white">Redis统计</CardTitle>
        <CardDescription className="text-gray-500">总体运行统计</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-[#0f0f0f] rounded-lg">
            <div className="text-xs text-gray-500 mb-1">已处理命�?/div>
            <div className="text-2xl font-bold text-orange-400">{totalCommands.toLocaleString()}</div>
          </div>
          <div className="text-center p-3 bg-[#0f0f0f] rounded-lg">
            <div className="text-xs text-gray-500 mb-1">键数�?/div>
            <div className="text-2xl font-bold text-emerald-400">{keysNum.toLocaleString()}</div>
          </div>
          <div className="text-center p-3 bg-[#0f0f0f] rounded-lg">
            <div className="text-xs text-gray-500 mb-1">总连接数</div>
            <div className="text-2xl font-bold text-purple-400">{totalConnections.toLocaleString()}</div>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#202020" />
            <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="fill" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
