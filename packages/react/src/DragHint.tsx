import type { ReactNode } from 'react';
import './DragHint.css';
import { ClosedHand } from './icons/ClosedHand';
import { OpenHand } from './icons/OpenHand';

export interface DragHintHotspot {
  x: number;
  y: number;
}

export interface DragHintProps {
  icons?: {
    idle: ReactNode;
    grabbing: ReactNode;
  };
  hotspot?: DragHintHotspot;
}
export function DragHint({
  icons = { idle: <OpenHand />, grabbing: <ClosedHand /> },
  hotspot = { x: 0.44, y: 0 },
}: DragHintProps) {
  return (
    <span className="gestik-drag-hint" aria-hidden="true">
      <svg
        className="gestik-drag-hint__scene"
        viewBox="0 0 112 72"
        width="112"
        height="72"
        fill="none"
      >
        <rect
          className="gestik-drag-hint__destination"
          x="69"
          y="26"
          width="30"
          height="30"
          rx="7"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </svg>

      <span className="gestik-drag-hint__drag-group">
        <span className="gestik-drag-hint__lift-group">
          <svg
            className="gestik-drag-hint__square"
            viewBox="0 0 32 32"
            width="32"
            height="32"
            fill="none"
          >
            <rect x="1" y="1" width="30" height="30" rx="7" stroke="currentColor" strokeWidth="2" />
          </svg>

          <span
            className="gestik-drag-hint__icon-anchor"
            style={{
              transform: `translate(${-hotspot.x * 100}%, ${-hotspot.y * 100}%)`,
            }}
          >
            <span className="gestik-drag-hint__icon gestik-drag-hint__icon--idle">
              {icons.idle}
            </span>
            <span className="gestik-drag-hint__icon gestik-drag-hint__icon--grabbing">
              {icons.grabbing}
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}
