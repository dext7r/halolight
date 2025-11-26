"use client"

import { X } from "lucide-react"
import * as React from "react"
import { Controller,useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input, InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface InputClearFormProps extends Omit<InputProps, 'onChange' | 'value'> {
  name: string
  showClear?: boolean
}

export const InputClearForm = React.forwardRef<HTMLInputElement, InputClearFormProps>(
  ({ className, type, name, showClear = true, ...props }, ref) => {
    const form = useFormContext()

    if (!form) {
      console.warn("InputClearForm must be used within a FormProvider")
      return <Input {...props} ref={ref} className={className} />
    }

    return (
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <div className="relative">
            <Input
              type={type}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              className={cn("pr-9", className)}
              ref={ref}
              {...props}
            />
            {showClear && field.value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 p-0 hover:bg-muted-foreground/20"
                onClick={() => field.onChange("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      />
    )
  }
)

InputClearForm.displayName = "InputClearForm"