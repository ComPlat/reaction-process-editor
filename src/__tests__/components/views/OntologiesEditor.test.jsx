import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import OntologiesEditor from '../../../components/views/OntologiesEditor';

const mockGetOntologies = jest.fn(() => Promise.resolve({ ontologies: [] }));

jest.mock('../../../fetchers/ReactionsFetcher', () => ({
  useReactionsFetcher: () => ({ getOntologies: mockGetOntologies }),
}));

jest.mock('../../../components/ontologies/OntologyFormModal', () => () => null);
jest.mock('../../../components/ontologies/OntologyListItem', () => () => null);
jest.mock('../../../components/utilities/IconButton', () => ({ icon, ...props }) => (
  <button type="button" data-icon={icon} {...props} />
));

const Location = () => <span data-testid="location">{useLocation().pathname}</span>;

describe('OntologiesEditor navbar', () => {
  beforeEach(() => {
    localStorage.setItem('bearer_auth_token', 'test-token');
    mockGetOntologies.mockClear();
    mockGetOntologies.mockResolvedValue({ ontologies: [] });
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('closes the editor by navigating to the reactions index', async () => {
    render(
      <MemoryRouter initialEntries={['/ontologies']}>
        <Routes>
          <Route path="*" element={<><OntologiesEditor /><Location /></>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(mockGetOntologies).toHaveBeenCalledTimes(1));
    const closeButton = screen.getByRole('button', { name: 'Close Ontology Editor' });
    expect(closeButton).toHaveAttribute('title', 'Close Ontology Editor');
    userEvent.click(closeButton);

    expect(screen.getByTestId('location')).toHaveTextContent('/reactions');
  });
});
