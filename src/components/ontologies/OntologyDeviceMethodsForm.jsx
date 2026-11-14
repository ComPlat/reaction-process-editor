import React, { useState } from 'react';

import { Button } from 'reactstrap';

import OntologyDeviceMethodDetectorFormModal from './OntologyDeviceMethodDetectorFormModal';
import OntologyDeviceMethodsListItem from './OntologyDeviceMethodsListItem';

const emptyMethod = () => ({
  active: true,
  value: '',
  label: '',
  detectors: [],
  mobile_phase: [],
  stationary_phase: [],
  default_inject_volume: { value: null, unit: 'mcl' },
  description: '',
});

export const validateDeviceMethods = (deviceMethods = []) => (
  deviceMethods.every(method => method.label?.trim())
);

const OntologyDeviceMethodsForm = ({ deviceMethods = [], detectorOptions, deviceTypeOptions, onChange }) => {
  const [detectorForm, setDetectorForm] = useState(null);

  const updateMethod = (methodIndex, key, value) => {
    const newMethods = deviceMethods.map(method => ({ ...method }));
    const method = newMethods[methodIndex];
    newMethods[methodIndex] = {
      ...method,
      value: method.value || method.label,
      [key]: value,
    };
    onChange(newMethods);
  };


  const addMethod = () => onChange([...deviceMethods, emptyMethod()]);

  const deleteMethod = (methodIndex) => {
    onChange(deviceMethods.filter((_, index) => index !== methodIndex));
  };

  const openDetectorForm = (methodIndex, detectorIndex = null) => {
    setDetectorForm({
      methodIndex,
      detectorIndex,
      detector: detectorIndex === null
        ? null
        : deviceMethods[methodIndex].detectors[detectorIndex],
    });
  };

  const saveDetector = (detector) => {
    const { methodIndex, detectorIndex } = detectorForm;
    const detectors = [...(deviceMethods[methodIndex].detectors || [])];

    if (detectorIndex === null) {
      detectors.push(detector);
    } else {
      detectors[detectorIndex] = detector;
    }

    updateMethod(methodIndex, 'detectors', detectors);
    setDetectorForm(null);
  };

  const deleteDetector = (methodIndex, detectorIndex) => {
    const detectors = (deviceMethods[methodIndex].detectors || [])
      .filter((_, index) => index !== detectorIndex);
    updateMethod(methodIndex, 'detectors', detectors);
  };

  return (
    <section
      className="mt-3 border p-3 bg-condition bg-opacity-25"
      aria-labelledby="ontology-methods-heading"
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 id="ontology-methods-heading" className="mb-0">
          Methods
        </h5>
        <Button type="button" color="success" size="sm" onClick={addMethod}>
          + Add Method
        </Button>
      </div>

      {deviceMethods.length === 0 && <div>No methods defined</div>}

      {deviceMethods.map((method, methodIndex) => (
        <OntologyDeviceMethodsListItem
          key={`method-${methodIndex}`}
          method={method}
          methodIndex={methodIndex}
          detectorOptions={detectorOptions}
          deviceTypeOptions={deviceTypeOptions}
          onUpdate={(key, value) => updateMethod(methodIndex, key, value)}
          onDelete={() => deleteMethod(methodIndex)}
          onOpenDetector={(detectorIndex) => openDetectorForm(methodIndex, detectorIndex)}
          onDeleteDetector={(detectorIndex) => deleteDetector(methodIndex, detectorIndex)}
        />
      ))}
      {detectorForm && (
        <OntologyDeviceMethodDetectorFormModal
          detector={detectorForm.detector}
          detectorOptions={detectorOptions}
          methodName={deviceMethods[detectorForm.methodIndex].label}
          onCancel={() => setDetectorForm(null)}
          onSave={saveDetector}
        />
      )}
    </section>
  );
};

export default OntologyDeviceMethodsForm;
