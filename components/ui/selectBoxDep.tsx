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

type OptionType = {
  value: string;
  label: string;
};

interface SelectBoxDepProps {
  data: OptionType[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  noDataText?: string;
}

const SelectBoxDep: React.FC<SelectBoxDepProps> = ({
  data,
  value,
  onValueChange,
  placeholder = "Seçiniz",
  noDataText = "Kayıt bulunamadı",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? data.find((e) => e.value === value)?.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Ara..." className="h-9" />
          <CommandList>
            <CommandEmpty>{noDataText}</CommandEmpty>
            <CommandGroup>
              {data.map((e) => (
                <CommandItem
                  key={e.value}
                  value={e.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    onValueChange(newValue);
                    setOpen(false);
                  }}
                >
                  {e.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === e.value ? "opacity-100" : "opacity-0"
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
