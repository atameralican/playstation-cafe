"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SelectBoxDepProps<
  T extends { [key: string]: string | number | boolean | null | undefined }
> {
  data: T[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  noDataText?: string;
  valueKey?: keyof T;
  labelKey?: keyof T;
}

const SelectBoxDep = <
  T extends { [key: string]: string | number | boolean | null | undefined }
>({
  data,
  value,
  onValueChange,
  placeholder = "Seçiniz",
  noDataText = "Kayıt bulunamadı",
  valueKey = "value",
  labelKey = "label",
}: SelectBoxDepProps<T>) => {
  const [open, setOpen] = useState(false);

  const getValue = (item: T) => String(item[valueKey] ?? "");
  const getLabel = (item: T) => String(item[labelKey] ?? "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? getLabel(data.find((e) => getValue(e) === value) as T)
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Ara..." className="h-9" />
          <CommandList>
            <CommandEmpty>{noDataText}</CommandEmpty>
            <CommandGroup>
              {data.map((e, i) => (
                <CommandItem
                  key={i}
                  value={getValue(e)}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    onValueChange(newValue);
                    setOpen(false);
                  }}
                >
                  {getLabel(e)}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === getValue(e) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectBoxDep;
