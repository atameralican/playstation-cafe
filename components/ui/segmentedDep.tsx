import React from "react";
import { SegmentedControl } from "@radix-ui/themes";

type OptionType = {
  value: string;
  label: string;
};

interface SegmentedDepProps {
  data: OptionType[];
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
  size?: "1" | "2" | "3";
  radius?: "none" | "small" | "medium" | "large" | "full";
}

const SegmentedDep: React.FC<SegmentedDepProps> = ({ 
  data, 
  value, 
  onValueChange, 
  defaultValue,
  ...props 
}) => {
  return (
    <SegmentedControl.Root 
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      {...props}
    >
      {data.map((e) => (
        <SegmentedControl.Item key={e.value} value={e.value}>
          {e.label}
        </SegmentedControl.Item>
      ))}
    </SegmentedControl.Root>
  );
};

export default SegmentedDep;