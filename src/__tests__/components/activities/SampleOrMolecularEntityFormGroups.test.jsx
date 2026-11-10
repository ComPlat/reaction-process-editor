import { render, screen } from '@testing-library/react';

import SampleOrMolecularEntityFormGroups from '../../../components/activities/forms/actions/analysis/SampleOrMolecularEntityFormGroups';

const renderGroups = ({ samples = [], molecularEntities = [] } = {}) => render(
  <SampleOrMolecularEntityFormGroups
    samples={samples}
    sampleOptions={[]}
    onSamplesChange={jest.fn()}
    molecularEntities={molecularEntities}
    molecularEntityOptions={[]}
    onMolecularEntitiesChange={jest.fn()}
  />
);

describe('Sample or Molecular Entity selection', () => {
  test('shows both alternatives before a selection is made', () => {
    renderGroups();

    expect(screen.getByText('Sample')).toBeInTheDocument();
    expect(screen.getByText('Molecular Entity')).toBeInTheDocument();
  });

  test('hides Molecular Entity when a Sample is selected', () => {
    renderGroups({ samples: [{ value: 'sample-1', label: 'Sample 1' }] });

    expect(screen.getByText('Sample')).toBeInTheDocument();
    expect(screen.queryByText('Molecular Entity')).not.toBeInTheDocument();
  });

  test('hides Sample when a Molecular Entity is selected', () => {
    renderGroups({
      molecularEntities: [{ value: 'molecule-1', label: 'Molecule 1' }],
    });

    expect(screen.queryByText('Sample')).not.toBeInTheDocument();
    expect(screen.getByText('Molecular Entity')).toBeInTheDocument();
  });

  test('keeps both populated alternatives visible for correcting legacy data', () => {
    renderGroups({
      samples: [{ value: 'sample-1', label: 'Sample 1' }],
      molecularEntities: [{ value: 'molecule-1', label: 'Molecule 1' }],
    });

    expect(screen.getByText('Sample')).toBeInTheDocument();
    expect(screen.getByText('Molecular Entity')).toBeInTheDocument();
  });
});
