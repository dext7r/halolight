"use client"

import { X } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input, InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface InputClearProps extends Omit<InputProps, "onChange"> {
  value?: string
  onChange?: (value: string) => void
  onClear?: () => void
  showClear?: boolean
  wrapperClassName?: string
}

export const InputClear = React.forwardRef<HTMLInputElement, InputClearProps>(
  (
    {
      className,
      wrapperClassName,
      type,
      value: valueProp,
      defaultValue,
      onChange,
      onClear,
      showClear = true,
      ...props
    },
    ref
  ) => {
    const isControlled = valueProp !== undefined
    const [internalValue, setInternalValue] = React.useState(() => {
      if (typeof defaultValue === "string") {
        return defaultValue
      }
      if (typeof valueProp === "string") {
        return valueProp
      }
      return ""
    })

    const value = isControlled ? valueProp ?? "" : internalValue

    React.useEffect(() => {
      if (!isControlled && typeof defaultValue === "string") {
        setInternalValue(defaultValue)
      }
    }, [defaultValue, isControlled])

    React.useEffect(() => {
      if (isControlled && typeof valueProp === "string") {
        setInternalValue(valueProp)
      }
    }, [isControlled, valueProp])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value
      if (!isControlled) {
        setInternalValue(next)
      }
      onChange?.(next)
    }

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("")
      }
      onClear?.()
      onChange?.("")
    }

    return (
      <div className={cn("relative w-full", wrapperClassName)}>
        <Input
          type={type}
          value={value}
          onChange={handleChange}
          className={cn("pr-9", className)}
          ref={ref}
          {...props}
        />
        {showClear && value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 p-0 hover:bg-muted-foreground/20"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    )
  }
)

InputClear.displayName = "InputClear"

export { InputClearForm } from "./input-clear-form"
