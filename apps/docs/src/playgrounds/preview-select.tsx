import { useId } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PreviewSelect = <Value extends string | number>({
  className,
  label,
  items,
  value,
  onValueChange,
}: {
  className?: string;
  label: string;
  items: readonly { label: string; value: Value }[];
  value: Value;
  onValueChange: (value: Value) => void;
}) => {
  const labelId = useId();

  return (
    <div className={className}>
      <span id={labelId} className="block font-medium">
        {label}
      </span>
      <Select<Value>
        items={items}
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue !== null) {
            onValueChange(nextValue);
          }
        }}
      >
        <SelectTrigger aria-labelledby={labelId} className="mt-2 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
