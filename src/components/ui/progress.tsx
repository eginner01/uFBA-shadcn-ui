import * as React from "react"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative h-4 w-full overflow-hidden rounded-full bg-[#252525] ${className || ''}`}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-gradient-to-r from-orange-500 to-orange-600 transition-all"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
