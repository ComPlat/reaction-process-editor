import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import OntologyFormModal from '../../../components/ontologies/OntologyFormModal';
import { SelectOptions } from '../../../contexts/SelectOptions';

jest.mock('../../../fetchers/ReactionsFetcher', () => ({
  useReactionsFetcher: () => ({ saveOntology: jest.fn() }),
}));

const ontology = {
  id: 1,
  ontology_id: 'TEST:001',
  ontology_type: 'TERMINOLOGY',
  label: 'Primary option',
  name: 'Primary',
  link: '',
  active: true,
  roles: {},
};

const ontologies = [
  ontology,
  {
    ...ontology,
    id: 2,
    ontology_id: 'TEST:002',
    label: 'Secondary option',
    name: 'Secondary',
  },
];

const renderModal = () => render(
  <SelectOptions.Provider value={{ ontologies }}>
    <OntologyFormModal ontology={ontology} isOpen onClose={jest.fn()} />
  </SelectOptions.Provider>
);

describe('OntologyFormModal', () => {
  test('renders the selectable ontology filter in the modal navbar', () => {
    renderModal();

    const filter = screen.getByPlaceholderText('Filter selectable Ontology options');

    expect(filter.closest('.modal-header')).toBeInTheDocument();
    expect(filter.closest('.modal-body')).not.toBeInTheDocument();
    expect(filter).toHaveAttribute(
      'title',
      'Filter the Ontologies in the Select Fields for a better overview'
    );
    expect(screen.getByText('Selectable: 2 / 2')).toBeInTheDocument();
  });

  test('filters selectable ontology options from the navbar', () => {
    renderModal();

    userEvent.type(screen.getByPlaceholderText('Filter selectable Ontology options'), 'Secondary');

    expect(screen.getByText('Selectable: 1 / 2')).toBeInTheDocument();
  });
});
