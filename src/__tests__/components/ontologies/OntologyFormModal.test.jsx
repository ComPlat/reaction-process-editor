import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import OntologyFormModal from '../../../components/ontologies/OntologyFormModal';
import NotificationContext from '../../../contexts/NotificationContext';
import { SelectOptions } from '../../../contexts/SelectOptions';

const mockSaveOntology = jest.fn();

jest.mock('../../../fetchers/ReactionsFetcher', () => ({
  useReactionsFetcher: () => ({ saveOntology: mockSaveOntology }),
}));

const addNotification = jest.fn();

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
  <NotificationContext.Provider value={{ addNotification }}>
    <SelectOptions.Provider value={{ ontologies }}>
      <OntologyFormModal ontology={ontology} isOpen onClose={jest.fn()} />
    </SelectOptions.Provider>
  </NotificationContext.Provider>
);

const renderDeviceModal = ({ onClose = jest.fn() } = {}) => render(
  <NotificationContext.Provider value={{ addNotification }}>
    <SelectOptions.Provider value={{
      ontologies: [
        { ...ontology, ontology_id: 'DET:001', label: 'UV detector', roles: { detector: [{}] } },
        {
          ...ontology,
          ontology_id: 'DEVICE:001',
          ontology_type: 'DEVICE_TYPE',
          label: 'HPLC device type',
        },
        { ...ontology, ontology_id: 'SOLVENT:001', label: 'Acetonitrile', roles: { solvent: [{}] } },
        { ...ontology, ontology_id: 'TYPE:001', label: 'Not a detector', roles: { type: [{}] } },
      ],
    }}>
      <OntologyFormModal
        ontology={{
          ...ontology,
          ontology_type: 'DEVICE_CONFIG',
          solvents: ['SOLVENT:001'],
          device_methods: [],
        }}
        isOpen
        onClose={onClose}
      />
    </SelectOptions.Provider>
  </NotificationContext.Provider>
);

describe('OntologyFormModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  test('shows Methods for devices with detector and device-type options', () => {
    renderDeviceModal();

    userEvent.click(screen.getByRole('button', { name: '+ Add Method' }));
    userEvent.click(screen.getByRole('button', { name: '+ Add Detector' }));
    userEvent.click(screen.getByLabelText('Detector'));

    expect(screen.getByText(/UV detector/)).toBeInTheDocument();
    expect(screen.queryByText(/Not a detector/)).not.toBeInTheDocument();

    userEvent.click(screen.getByText(/UV detector/));
    const detectorModal = screen
      .getByRole('heading', { name: 'Add Detector - Unnamed Method' })
      .closest('.modal-content');
    userEvent.click(within(detectorModal).getByRole('button', { name: 'Save' }));
    expect(screen.getByRole('button', { name: 'Edit detector 1' })).toBeInTheDocument();

    const mobilePhaseSelect = screen.getByLabelText('Method 1 mobile phase');
    userEvent.click(mobilePhaseSelect);

    const mobilePhaseControl = mobilePhaseSelect.closest('.react-select--overwrite');
    expect(within(mobilePhaseControl).getByText(/HPLC device type/)).toBeInTheDocument();
    expect(within(mobilePhaseControl).queryByText(/Acetonitrile/)).not.toBeInTheDocument();
  });

  test('prevents saving a device method without a label and shows a notification', () => {
    const onClose = jest.fn();
    renderDeviceModal({ onClose });

    userEvent.click(screen.getByRole('button', { name: '+ Add Method' }));
    userEvent.click(screen.getAllByRole('button', { name: 'Save' })[0]);

    expect(mockSaveOntology).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(addNotification).toHaveBeenCalledWith({
      title: 'Device method label required',
      message: 'Enter a label for every device method before saving.',
      type: 'warning',
    });
  });
});
