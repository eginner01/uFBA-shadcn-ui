interface PlaceholderPageProps {
  title: string
  description?: string
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          此页面正在开发中...
        </p>
      </div>
    </div>
  )
}
