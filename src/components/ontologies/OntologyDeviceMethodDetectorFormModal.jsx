import React, { useState } from 'react';

import Select from 'react-select';
import { Label, Modal, ModalBody, ModalHeader } from 'reactstrap';

import FormButtons from '../utilities/FormButtons';
import DetectorConditionsFormGroup from '../activities/forms/formgroups/DetectorConditionsFormGroup';
import { AnalysisDefaultsConstants } from '../../constants/AnalysisDefaultsConstants';
import { OntologyConstants } from '../../constants/OntologyConstants';
import { SubFormController, SubFormToggle } from '../../contexts/SubFormController';

const detectorValue = (detector) => detector?.value || detector || null;

const analysisDefaultsFor = (detectorOption) => {
  if (detectorOption?.analysis_defaults?.length) return detectorOption.analysis_defaults;

  const detectorName = Object.entries(OntologyConstants.detector_ontology_id)
    .find(([, ontologyId]) => ontologyId === detectorOption?.ontology_id)?.[0];
  const defaults = AnalysisDefaultsConstants[detectorName];

  return defaults ? [defaults] : [];
};

const detectorConditionsFor = (detector) => {
  const value = detectorValue(detector);
  if (!value) return {};

  return {
    [value]: Object.fromEntries(
      (detector.analysis_defaults || []).map(defaults => [defaults.metric_name, defaults.values]),
    ),
  };
};

const OntologyDeviceMethodDetectorFormModal = ({
  detector,
  detectorOptions,
  methodName,
  onCancel,
  onSave,
}) => {
  const subFormController = SubFormToggle();
  const [selectedOption, setSelectedOption] = useState(() => {
    const value = detectorValue(detector);
    return detectorOptions?.find(option => option.value === value) || null;
  });
  const [detectorConditions, setDetectorConditions] = useState(detectorConditionsFor(detector));

  const selectedDetector = selectedOption?.value || null;
  const analysisDefaults = analysisDefaultsFor(selectedOption);

  const changeDetector = (selected) => {
    const value = selected?.value || null;
    setSelectedOption(selected);
    setDetectorConditions(value ? { [value]: {} } : {});
  };

  const configuredDetector = () => {
    const configuredDetectorBase = {
      value: selectedDetector,
      ...(selectedOption?.ontology_id && { ontology_id: selectedOption.ontology_id }),
    };

    return {
      ...configuredDetectorBase,
      analysis_defaults: analysisDefaults.map(defaults => ({
        ...defaults,
        values: detectorConditions?.[selectedDetector]?.[defaults.metric_name],
      })),
    };
  };

  return (
    <Modal
      className="d-flex align-items-center justify-content-center modal--primary"
      isOpen
      toggle={onCancel}
      backdrop="static"
    >
      <ModalHeader>
        {detector ? 'Edit Detector' : 'Add Detector'}
        {' - '}
        {methodName || 'Unnamed Method'}
      </ModalHeader>
      <ModalBody>
        <Label>Detector</Label>
        <Select
          aria-label="Detector"
          className="react-select--overwrite mb-3"
          classNamePrefix="react-select"
          options={detectorOptions}
          value={selectedOption}
          isClearable
          onChange={changeDetector}
        />
        <SubFormController.Provider value={subFormController}>
          <DetectorConditionsFormGroup
            detectorsOptions={selectedOption ? [{ ...selectedOption, analysis_defaults: analysisDefaults }] : []}
            detectorConditions={detectorConditions}
            onChange={setDetectorConditions}
          />
        </SubFormController.Provider>
        <FormButtons
          type="primary"
          onCancel={onCancel}
          onSave={() => onSave(configuredDetector())}
          disableSave={!selectedDetector}
        />
      </ModalBody>
    </Modal>
  );
};

export default OntologyDeviceMethodDetectorFormModal;
