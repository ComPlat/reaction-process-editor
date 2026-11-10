import { render, screen } from '@testing-library/react';

import ChromatographyPoolingForm from '../../../components/utilities/ChromatographyPoolingForm';

jest.mock('react-dnd', () => ({
  DndProvider: ({ children }) => children,
}));
jest.mock('react-dnd-html5-backend', () => ({ HTML5Backend: {} }));
jest.mock('../../../components/utilities/ChromatographyFractionForm', () => () => null);
jest.mock('../../../components/utilities/VialButton', () => () => null);
jest.mock('../../../fetchers/ReactionsFetcher', () => ({
  useReactionsFetcher: () => ({ createFractionActivities: jest.fn() }),
}));

describe('ChromatographyPoolingForm', () => {
  test('shows the pooling instructions as hint text and a tooltip', () => {
    const hint = 'Define 1 or more pooling fractions and assign the pooled vials along with the respective followup action to each fraction.';

    render(
      <ChromatographyPoolingForm
        activity={{
          id: 'activity-1',
          automation_response: {
            vialPlates: [{ trayType: 'fixture tray', trayColumns: 1, vials: ['1'] }],
          },
        }}
        onCancel={jest.fn()}
        onSave={jest.fn()}
      />
    );

    expect(screen.getByText(hint)).toBeInTheDocument();
    const addFractionButton = screen.getByRole('button', { name: '+ Add Fraction' });
    const tooltip = screen.getByTitle(hint);
    expect(addFractionButton.parentElement).toContainElement(tooltip);
    expect(tooltip).toHaveClass('me-2');
    expect(tooltip.querySelector('svg')).toHaveClass('text-secondary');
    expect(tooltip.querySelector('svg')).toHaveClass('fa-lg');
    expect(tooltip.compareDocumentPosition(addFractionButton)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });
});
