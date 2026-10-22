/** @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DragHint } from './DragHint';

afterEach(cleanup);

describe('DragHint', () => {
  it('is decorative and drags right by default', () => {
    const { container } = render(<DragHint />);
    const hint = container.firstElementChild;

    expect(hint?.getAttribute('aria-hidden')).toBe('true');
    expect(hint?.getAttribute('data-direction')).toBe('right');
  });

  it('reserves proportional space at a custom size', () => {
    const { container } = render(<DragHint direction="left" size={84} />);
    const hint = container.firstElementChild as HTMLElement | null;

    expect(hint?.dataset.direction).toBe('left');
    expect(hint?.style.width).toBe('84px');
    expect(hint?.style.height).toBe('54px');
  });

  it('renders custom poses at the requested hotspot', () => {
    const { container } = render(
      <DragHint
        className="custom-hint"
        icons={{
          idle: <svg data-testid="idle-pose" />,
          grabbing: <svg data-testid="grabbing-pose" />,
        }}
        hotspot={{ x: 0.25, y: 0.75 }}
      />,
    );

    expect(container.firstElementChild?.classList.contains('custom-hint')).toBe(true);
    expect(
      container
        .querySelector('.gestik-drag-hint__icon--idle')
        ?.contains(screen.getByTestId('idle-pose')),
    ).toBe(true);
    expect(
      container
        .querySelector('.gestik-drag-hint__icon--grabbing')
        ?.contains(screen.getByTestId('grabbing-pose')),
    ).toBe(true);

    const anchor = container.querySelector<HTMLElement>('.gestik-drag-hint__icon-anchor');
    expect(anchor?.style.transform).toBe('translate(-25%, -75%)');
  });
});
