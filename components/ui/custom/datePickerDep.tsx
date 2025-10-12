"use client"

import * as React from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerDepProps {
  value?: Date | null 
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  onValueChange?: (date: Date | null | undefined) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function DatePickerDep({
  value,
  onValueChange,
  className,
  variant = "outline",
  placeholder = "Tarih seçin",
  disabled = false,
}: DatePickerDepProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          data-empty={!value}
          disabled={disabled}
          className={cn(
            "data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "d MMMM yyyy", { locale: tr }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={(date) => {
            onValueChange?.(date)
            setOpen(false) // Tarih seçilince popover'ı kapat
          }}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}