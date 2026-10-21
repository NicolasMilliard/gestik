import { CursorIcon } from './icons/CursorIcon';
import { PointerIcon } from './icons/PointerIcon';

export type DragHintInput = 'pointer' | 'cursor';

export interface DragHintProps {
  input?: DragHintInput;
}

export function DragHint({ input = 'pointer' }: DragHintProps) {
  const hotspot = { x: 0.2, y: -0.1 };

  return (
    <span
      aria-hidden="true"
      style={{
        position: 'relative',
        display: 'inline-block',
        width: 120,
        height: 72,
        color: 'inherit',
        pointerEvents: 'none',
        verticalAlign: 'middle',
      }}
    >
      <svg width="120" height="72" viewBox="0 0 120 72" fill="none" style={{ display: 'block' }}>
        <path
          d="M52 41h15m-6-6 6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="76"
          y="25"
          width="32"
          height="32"
          rx="7"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.45"
        />
      </svg>

      <span style={{ position: 'absolute', left: 12, top: 25, width: 32, height: 32 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="1" y="1" width="30" height="30" rx="7" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>

      <span style={{ position: 'absolute', left: 28, top: 41 }}>
        <span
          style={{
            display: 'block',
            width: 24,
            height: 24,
            transform: `translate(${-hotspot.x * 100}%, ${-hotspot.y * 100}%)`,
          }}
        >
          {input === 'pointer' ? <PointerIcon /> : <CursorIcon />}
        </span>
      </span>
    </span>
  );
}
