"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"
import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "h-4 w-4 shrink-0 rounded-sm border border-slate-300",
      "bg-white transition-all duration-150",
      "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      "hover:border-slate-400",
      "data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator 
      className={cn("flex items-center justify-center text-white")}
    >
      <CheckIcon className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))

Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }