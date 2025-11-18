import { type ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface ManagementPageTemplateProps {
  title: string;
  description: string;
  onRefresh?: () => void;
  onAdd?: () => void;
  children: ReactNode;
  showAddButton?: boolean;
}

export default function ManagementPageTemplate({
  title,
  description,
  onRefresh,
  onAdd,
  children,
  showAddButton = true
}: ManagementPageTemplateProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        <div className="flex gap-2">
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} className="border-[#333333] hover:bg-[#252525]">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          )}
          {showAddButton && onAdd && (
            <Button onClick={onAdd} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              新增
            </Button>
          )}
        </div>
      </div>

      <Card className="border border-[#333333] bg-[#1e1e1e]">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
