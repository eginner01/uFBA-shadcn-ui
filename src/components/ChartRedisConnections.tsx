import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

interface RedisConnectionData {
  total_connections_received?: number
  blocked_clients?: number
  rejected_connections?: number
  connected_clients?: number
}

interface ChartRedisConnectionsProps {
  data: RedisConnectionData
}

export function ChartRedisConnections({ data }: ChartRedisConnectionsProps) {
  const chartData = [
    { 
      name: "已连接客户端", 
      value: data.connected_clients || 0, 
      fill: "hsl(var(--chart-1))" 
    },
    { 
      name: "阻塞客户�?, 
      value: data.blocked_clients || 0, 
      fill: "hsl(var(--chart-2))" 
    },
    { 
      name: "拒绝连接", 
      value: data.rejected_connections || 0, 
      fill: "hsl(var(--chart-3))" 
    },
  ].filter(item => item.value > 0) // 只显示有数值的�?

  const chartConfig = {
    value: {
      label: "连接�?,
    },
    connected: {
      label: "已连接客户端",
      color: "hsl(var(--chart-1))",
    },
    blocked: {
      label: "阻塞客户�?,
      color: "hsl(var(--chart-2))",
    },
    rejected: {
      label: "拒绝连接",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig

  const totalConnections = React.useMemo(() => {
    return data.total_connections_received || 0
  }, [data])

  const activeConnections = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [chartData])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>连接统计</CardTitle>
        <CardDescription>Redis客户端连接状�?/CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {activeConnections.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          活跃连接
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          总连接数: {totalConnections.toLocaleString()} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          显示当前Redis客户端连接状�?
        </div>
      </CardFooter>
    </Card>
  )
}
