"use client"

import { Command as CommandPrimitive } from "cmdk"
import { X } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

interface CommandInputClearProps
  extends React.ComponentProps<typeof CommandPrimitive.Input> {
  showClear?: boolean
}

export const CommandInputClear = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  CommandInputClearProps
>(({ className, showClear = true, value: valueProp, defaultValue = "", onValueChange, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = React.useState(() => {
    if (typeof valueProp === "string") return valueProp
    return typeof defaultValue === "string" ? defaultValue : ""
  })

  const value = isControlled ? valueProp ?? "" : internalValue

  React.useEffect(() => {
    if (!isControlled && typeof defaultValue === "string") {
      setInternalValue(defaultValue)
    }
  }, [defaultValue, isControlled])

  const handleValueChange = React.useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternalValue(next)
      }
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  React.useImperativeHandle(ref, () => inputRef.current!)

  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3 relative"
    >
      <svg
        className="size-4 shrink-0 opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
      <CommandPrimitive.Input
        ref={inputRef}
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        value={value}
        onValueChange={handleValueChange}
        {...props}
      />
      {showClear && value && (
        <button
          type="button"
          className="absolute right-3 h-5 w-5 p-0 flex items-center justify-center rounded hover:bg-muted-foreground/20"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleValueChange("")
            inputRef.current?.focus()
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
})

CommandInputClear.displayName = "CommandInputClear"
