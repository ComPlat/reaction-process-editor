import { fireEvent, screen } from '@testing-library/react';

import {
  reaction2ProcessWithSteps,
  renderReaction2Steps,
} from '../../../testSupport/reaction2TestHelpers';

describe('resizable step columns', () => {
  const dispatchPointerEvent = (target, type, clientX) => {
    fireEvent(target, new MouseEvent(type, { bubbles: true, clientX }));
  };

  test('marks every process step as horizontally resizable', () => {
    const reactionProcess = reaction2ProcessWithSteps(['Charge reactor', 'Heat mixture']);
    const { container } = renderReaction2Steps({ reactionProcess });

    const stepColumns = container.querySelectorAll('.procedure-card--step.step-column-card');
    expect(stepColumns).toHaveLength(reactionProcess.reaction_process_steps.length);
    stepColumns.forEach((stepColumn) => {
      expect(stepColumn).toHaveClass('procedure-card--column');
    });
  });

  test('resizes a process step from either vertical edge', () => {
    const reactionProcess = reaction2ProcessWithSteps(['Charge reactor', 'Heat mixture']);
    const { container } = renderReaction2Steps({ reactionProcess });
    const resizeContainer = container.querySelector('.step-column-card__resize-container');
    const rightHandle = screen.getAllByRole('separator', {
      name: 'Resize step column from right edge',
    })[0];
    const leftHandle = screen.getAllByRole('separator', {
      name: 'Resize step column from left edge',
    })[0];

    expect(resizeContainer).toHaveStyle({ width: '360px' });
    dispatchPointerEvent(rightHandle, 'pointerdown', 100);
    dispatchPointerEvent(window, 'pointermove', 200);
    dispatchPointerEvent(window, 'pointerup', 200);
    expect(resizeContainer).toHaveStyle({ width: '460px' });

    dispatchPointerEvent(leftHandle, 'pointerdown', 100);
    dispatchPointerEvent(window, 'pointermove', 150);
    dispatchPointerEvent(window, 'pointerup', 150);
    expect(resizeContainer).toHaveStyle({ width: '410px' });
  });
});
