import { Field } from "@base-ui/react/field";
import { Slider } from "@base-ui/react/slider";

export const PreviewSlider = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onValueChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onValueChange: (value: number) => void;
}) => (
  <Field.Root className="mb-5">
    <Slider.Root
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={onValueChange}
      thumbAlignment="center"
    >
      <div className="flex items-center justify-between gap-3">
        <Field.Label className="font-medium">{label}</Field.Label>
        <Slider.Value className="text-zinc-500 tabular-nums">
          {() => `${value}${unit}`}
        </Slider.Value>
      </div>
      <Slider.Control className="relative mt-2 flex h-6 w-full touch-none items-center select-none">
        <Slider.Track className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
          <Slider.Indicator className="h-full rounded-full bg-brand" />
        </Slider.Track>
        <Slider.Thumb className="block size-4 rounded-full border border-brand bg-white shadow-xs transition-shadow outline-none hover:ring-4 hover:ring-brand/10 has-focus-visible:ring-4 has-focus-visible:ring-brand/25 data-dragging:ring-4 data-dragging:ring-brand/15 motion-reduce:transition-none" />
      </Slider.Control>
    </Slider.Root>
  </Field.Root>
);
