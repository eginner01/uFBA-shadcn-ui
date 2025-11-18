import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPageTemplate({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        <Button variant="outline" className="border-[#333333] hover:bg-[#252525]">
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新
        </Button>
      </div>

      <Card className="border border-[#333333] bg-[#1e1e1e]">
        <CardContent className="p-6">
          <p className="text-gray-400 text-center py-8">功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  );
}
