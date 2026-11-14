import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import OntologyDeviceMethodsForm from '../../../components/ontologies/OntologyDeviceMethodsForm';

const detectorOptions = [
  { value: 'DET:001', label: 'UV detector' },
  { value: 'DET:002', label: 'Mass detector' },
  { value: 'DET:PDA', label: 'Detector one', ontology_id: 'CHMO:0001728' },
  { value: 'DET:ELSD', label: 'Detector two', ontology_id: 'CHMO:0002866' },
  { value: 'DET:MS', label: 'Detector three', ontology_id: 'CHMO:0002337' },
];

const deviceTypeOptions = [
  { value: 'solvent-1', label: 'Acetonitrile' },
  { value: 'solvent-2', label: 'Water' },
];

const MethodsHarness = ({ initialMethods = [] }) => {
  const [deviceMethods, setDeviceMethods] = useState(initialMethods);

  return (
    <>
      <OntologyDeviceMethodsForm
        deviceMethods={deviceMethods}
        detectorOptions={detectorOptions}
        deviceTypeOptions={deviceTypeOptions}
        onChange={setDeviceMethods}
      />
      <output aria-label="device methods state">{JSON.stringify(deviceMethods)}</output>
    </>
  );
};

const deviceMethodsState = () => JSON.parse(screen.getByLabelText('device methods state').textContent);

describe('OntologyDeviceMethodsForm', () => {
  test('creates and edits a method with detector, solvent, text, and volume fields', () => {
    render(<MethodsHarness />);

    userEvent.click(screen.getByRole('button', { name: '+ Add Method' }));
    fireEvent.change(screen.getByLabelText('Method 1 label'), { target: { value: 'HPLC method' } });
    userEvent.type(screen.getByLabelText('Method 1 stationary phase'), 'C18');
    userEvent.type(screen.getByLabelText('Method 1 description'), 'Routine separation');

    userEvent.click(screen.getByRole('button', { name: '+ Add Detector' }));
    expect(screen.getByRole('heading', { name: 'Add Detector - HPLC method' })).toBeInTheDocument();
    userEvent.click(screen.getByLabelText('Detector'));
    userEvent.click(screen.getByText('UV detector'));
    userEvent.click(screen.getByRole('button', { name: 'Save' }));

    userEvent.click(screen.getByLabelText('Method 1 mobile phase'));
    userEvent.click(screen.getByText('Acetonitrile'));

    expect(screen.getByText('Default Inj. Volume')).toBeInTheDocument();
    expect(deviceMethodsState()[0]).toEqual(expect.objectContaining({
      active: true,
      value: 'HPLC method',
      label: 'HPLC method',
      detectors: [{ value: 'DET:001', analysis_defaults: [] }],
      mobile_phase: [{ value: 'solvent-1', label: 'Acetonitrile' }],
      stationary_phase: [{ value: 'C18', label: 'C18' }],
      default_inject_volume: { value: null, unit: 'mcl' },
      description: 'Routine separation',
    }));
  });

  test('removes detector rows and marks complete methods inactive', () => {
    render(<MethodsHarness />);

    userEvent.click(screen.getByRole('button', { name: '+ Add Method' }));
    userEvent.click(screen.getByRole('button', { name: '+ Add Detector' }));
    userEvent.click(screen.getByLabelText('Detector'));
    userEvent.click(screen.getByText('UV detector'));
    userEvent.click(screen.getByRole('button', { name: 'Save' }));

    userEvent.click(screen.getByRole('button', { name: 'Edit detector 1' }));
    userEvent.click(screen.getByLabelText('Detector'));
    userEvent.click(screen.getByText('Mass detector'));
    userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(deviceMethodsState()[0].detectors).toEqual([{
      value: 'DET:002',
      analysis_defaults: [],
    }]);

    userEvent.click(screen.getByRole('button', { name: 'Delete detector 1' }));

    expect(deviceMethodsState()[0].detectors).toEqual([]);

    const activeCheckbox = screen.getByRole('checkbox', { name: 'Active' });
    expect(activeCheckbox).toBeChecked();

    userEvent.click(activeCheckbox);
    expect(deviceMethodsState()[0].active).toBe(false);

    userEvent.click(screen.getByRole('button', { name: 'Delete Method' }));
    expect(deviceMethodsState()).toEqual([]);
  });

  test('disables deletion for a persisted method', () => {
    render(<MethodsHarness initialMethods={[{
      id: 42,
      active: true,
      label: 'Persisted method',
      detectors: [],
      mobile_phase: [],
      stationary_phase: [],
      default_inject_volume: { value: null, unit: 'mcl' },
      description: '',
    }]} />);

    const deleteButton = screen.getByRole('button', { name: 'Delete Method' });
    expect(deleteButton).toBeDisabled();
    expect(deleteButton).toHaveAttribute(
      'title',
      'Methods can not be deleted. Deactivate to remove from current Lab setup.',
    );
  });

  test('shows detector-specific fields according to ontology_id and saves MS parameters', () => {
    render(<MethodsHarness />);

    userEvent.click(screen.getByRole('button', { name: '+ Add Method' }));
    userEvent.click(screen.getByRole('button', { name: '+ Add Detector' }));
    userEvent.click(screen.getByLabelText('Detector'));
    userEvent.click(screen.getByText('Detector one'));

    expect(screen.getByText('Wavelengths (nm):')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Set' }));
    expect(screen.getByRole('button', { name: 'Add Wavelength' })).toBeInTheDocument();

    userEvent.click(screen.getByLabelText('Detector'));
    userEvent.click(screen.getByText('Detector two'));

    expect(screen.getByText('Temperature:')).toBeInTheDocument();
    expect(screen.queryByText('Wavelengths')).not.toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Set' }));

    userEvent.click(screen.getByLabelText('Detector'));
    userEvent.click(screen.getByText('Detector three'));
    userEvent.click(screen.getByRole('button', { name: 'Set' }));
    userEvent.type(screen.getByLabelText('Parameter'), 'positive ion mode');
    userEvent.click(screen.getByRole('button', { name: 'Set' }));
    userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(deviceMethodsState()[0].detectors).toEqual([{
      value: 'DET:MS',
      ontology_id: 'CHMO:0002337',
      analysis_defaults: [{
        label: 'Parameter',
        data_type: 'TEXT',
        metric_name: 'MS_PARAMETER',
        values: 'positive ion mode',
      }],
    }]);
    expect(screen.getByText('MS parameter: positive ion mode')).toBeInTheDocument();
  });

  test('preserves detector configuration while editing', () => {
    render(<MethodsHarness />);

    userEvent.click(screen.getByRole('button', { name: '+ Add Method' }));
    userEvent.click(screen.getByRole('button', { name: '+ Add Detector' }));
    userEvent.click(screen.getByLabelText('Detector'));
    userEvent.click(screen.getByText('Detector three'));
    userEvent.click(screen.getByRole('button', { name: 'Set' }));
    userEvent.type(screen.getByLabelText('Parameter'), 'negative ion mode');
    userEvent.click(screen.getByRole('button', { name: 'Set' }));
    userEvent.click(screen.getByRole('button', { name: 'Save' }));

    userEvent.click(screen.getByRole('button', { name: 'Edit detector 1' }));
    userEvent.click(screen.getByRole('button', { name: 'Change' }));
    expect(screen.getByLabelText('Parameter')).toHaveValue('negative ion mode');
  });
});
