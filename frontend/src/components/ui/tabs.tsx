import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "relative flex h-12 w-full items-center rounded-[8px] bg-muted p-1",
        className
      )}
      {...props}
    />
  )
}

function TabsIndicator({
  className,
  ...props
}: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "absolute top-1 left-0 h-[calc(100%-8px)] w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] rounded-[6px] bg-background shadow-sm transition-all duration-200 ease-out",
        className
      )}
      {...props}
    />
  )
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      className={cn(
        "relative z-10 gap-3 flex h-full flex-1 items-center justify-center rounded-[6px] text-sm font-medium text-muted-foreground transition-colors outline-none select-none data-[selected]:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsIndicator, TabsTab }
