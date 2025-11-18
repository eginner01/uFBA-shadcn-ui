import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';

interface DiskInfo {
  dir: string;
  type: string;
  device: string;
  total: string;
  free: string;
  used: string;
  usage: string;
}

interface ChartDiskUsageProps {
  disks: DiskInfo[];
}

export function ChartDiskUsage({ disks }: ChartDiskUsageProps) {
  const data = disks.map((disk) => ({
    name: disk.dir,
    usage: parseFloat(disk.usage) || 0,
  }));

  const chartConfig = {
    usage: {
      label: '使用�?,
    },
  };

  const getBarColor = (usage: number) => {
    if (usage < 50) return '#10b981'; // emerald-500
    if (usage < 80) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  };

  return (
    <Card className="border border-[#202020] bg-[#141414]">
      <CardHeader>
        <CardTitle className="text-white">磁盘监控</CardTitle>
        <CardDescription className="text-gray-500">各分区使用情�?/CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {disks.slice(0, 3).map((disk, index) => (
            <div key={index} className="p-3 bg-[#0f0f0f] rounded-lg">
              <div className="text-xs text-gray-500 mb-1">{disk.dir}</div>
              <div className="text-lg font-bold text-white">
                {disk.used} / {disk.total}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                使用�? <span className={
                  parseFloat(disk.usage) < 50 ? 'text-emerald-500' :
                  parseFloat(disk.usage) < 80 ? 'text-yellow-500' :
                  'text-red-500'
                }>{disk.usage}</span>
              </div>
            </div>
          ))}
        </div>

        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#202020" />
            <XAxis type="category" dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
            <YAxis type="number" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} domain={[0, 100]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="usage" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.usage)} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
