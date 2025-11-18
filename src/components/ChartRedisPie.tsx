import { Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

interface ChartRedisPieProps {
  usedMemory: number  // MB
  totalMemory?: number // MB，如果没有就用示例�?
}

export function ChartRedisPie({ usedMemory, totalMemory = 1024 }: ChartRedisPieProps) {
  const freeMemory = Math.max(totalMemory - usedMemory, 0)
  
  const chartData = [
    { 
      name: "已用内存", 
      value: Number(usedMemory.toFixed(2)), 
      fill: "hsl(var(--chart-1))" 
    },
    { 
      name: "空闲内存", 
      value: Number(freeMemory.toFixed(2)), 
      fill: "hsl(var(--chart-2))" 
    },
  ]

  const chartConfig = {
    value: {
      label: "内存 (MB)",
    },
    used: {
      label: "已用内存",
      color: "hsl(var(--chart-1))",
    },
    free: {
      label: "空闲内存",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  const usagePercent = ((usedMemory / totalMemory) * 100).toFixed(1)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>内存使用情况</CardTitle>
        <CardDescription>
          使用�? {usagePercent}%
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip 
              content={<ChartTooltipContent hideLabel />} 
            />
            <Pie 
              data={chartData} 
              dataKey="value" 
              nameKey="name"
              label={({ name, value }) => `${name}: ${value} MB`}
              labelLine={true}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-1))' }} />
            <span className="text-muted-foreground">已用: {usedMemory.toFixed(2)} MB</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-2))' }} />
            <span className="text-muted-foreground">空闲: {freeMemory.toFixed(2)} MB</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
