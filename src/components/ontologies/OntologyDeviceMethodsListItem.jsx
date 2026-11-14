import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import { Button, FormGroup, Input, Label } from 'reactstrap';

import MetricsInputFormGroup from '../activities/forms/formgroups/MetricsInputFormGroup';
import IconButton from '../utilities/IconButton';
import MetricsDecorator from '../../decorators/MetricsDecorator';

const detectorSettingsInfo = (detector) => {
  if (!detector || typeof detector !== 'object') return null;
  const analysisDefaults = Object.fromEntries(
    (detector.analysis_defaults || []).map(defaults => [defaults.metric_name, defaults.values]),
  );

  if (analysisDefaults.WAVELENGTHS?.peaks?.length) {
    const values = analysisDefaults.WAVELENGTHS.peaks
      .map(peak => peak?.value)
      .filter(value => value || value === 0);

    if (values.length) {
      return analysisDefaults.WAVELENGTHS.is_range
        ? `Wavelength range: ${values[0]} - ${values.at(-1)} nm`
        : `Wavelength peaks: ${values.join(', ')} nm`;
    }
  }

  const temperature = MetricsDecorator.infoAmount(analysisDefaults.TEMPERATURE);
  if (temperature) return `Temperature: ${temperature}`;

  if (analysisDefaults.MS_PARAMETER?.trim()) {
    return `MS parameter: ${analysisDefaults.MS_PARAMETER}`;
  }

  return null;
};

const OntologyDeviceMethodsListItem = ({
  method,
  methodIndex,
  detectorOptions = [],
  deviceTypeOptions = [],
  onUpdate,
  onDelete,
  onOpenDetector,
  onDeleteDetector,
}) => (
  <div className="border-top py-3">
    <div className="row gx-2 align-items-start">
      <div className="col-auto pt-4">
        <Button
          type="button"
          color="danger"
          size="sm"
          aria-label="Delete Method"
          title={method.id
            ? 'Methods can not be deleted. Deactivate to remove from current Lab setup.'
            : 'Delete Method'}
          disabled={Boolean(method.id)}
          onClick={onDelete}
        >
          <FontAwesomeIcon icon="trash" size="sm" />
        </Button>
      </div>

      <FormGroup className="col mb-0">
        <Label>Name</Label>
        <Input
          aria-label={`Method ${methodIndex + 1} label`}
          value={method.label || ""}
          placeholder="Label"
          onChange={(event) => onUpdate("label", event.target.value)}
        />
      </FormGroup>

      <FormGroup className="col mb-0">
        <Label>Stationary Phase</Label>
        <Input
          aria-label={`Method ${methodIndex + 1} stationary phase`}
          value={method.stationary_phase?.[0] || ""}
          placeholder="Stationary Phase"
          onChange={(event) => {
            const value = event.target.value;
            onUpdate("stationary_phase", value ? [value] : []);
          }}
        />
      </FormGroup>

      <FormGroup className="col mb-0">
        <MetricsInputFormGroup
          metricName="INJECT_VOLUME"
          label="Inj. Volume"
          amount={method.default_inject_volume}
          onChange={(value) => onUpdate("default_inject_volume", value)}
        />
      </FormGroup>

      <FormGroup className="col mb-0">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Label className="mb-0">Detectors</Label>
          <Button type="button" size="sm" onClick={() => onOpenDetector()}>
            + Add Detector
          </Button>
        </div>
        {(method.detectors || []).map((detector, detectorIndex) => {
          const settingsInfo = detectorSettingsInfo(detector);

          return (
            <div
              className="d-flex align-items-center gap-2 mb-2"
              key={`method-${methodIndex}-detector-${detectorIndex}`}
            >
              <div className="flex-grow-1">
                <div>
                  {detectorOptions.find(
                    (option) => option.value === detector.value,
                  )?.label || detector.value}
                </div>
                {settingsInfo && (
                  <small className="text-muted">{settingsInfo}</small>
                )}
              </div>
              <IconButton
                icon="pen"
                aria-label={`Edit detector ${detectorIndex + 1}`}
                title="Edit Detector"
                className="text-primary"
                size="sm"
                onClick={() => onOpenDetector(detectorIndex)}
              />
              <IconButton
                icon="trash"
                aria-label={`Delete detector ${detectorIndex + 1}`}
                title="Delete Detector"
                className="text-danger"
                size="sm"
                onClick={() => onDeleteDetector(detectorIndex)}
              />
            </div>
          );
        })}
      </FormGroup>
    </div>

    <div className="row gx-2 align-items-start mt-3">
      <div className="col-auto pt-4">
        <FormGroup check>
          <Input
            id={`method-${methodIndex}-active`}
            type="checkbox"
            checked={method.active !== false}
            onChange={(event) => onUpdate("active", event.target.checked)}
          />
          <Label check htmlFor={`method-${methodIndex}-active`}>
            Active
          </Label>
        </FormGroup>
      </div>

      <FormGroup className="col mb-0">
        <Label>Description</Label>
        <Input
          aria-label={`Method ${methodIndex + 1} description`}
          value={method.description || ""}
          placeholder="Description"
          onChange={(event) => onUpdate("description", event.target.value)}
        />
      </FormGroup>

      <FormGroup className="col mb-0">
        <Label>Mobile Phase</Label>
        <Select
          aria-label={`Method ${methodIndex + 1} mobile phase`}
          className="react-select--overwrite"
          classNamePrefix="react-select"
          options={deviceTypeOptions}
          value={{ label: method.mobile_phase?.[0] } || null}
          isClearable
          onChange={(selected) =>
            onUpdate("mobile_phase", selected ? [selected.label] : [])
          }
        />
      </FormGroup>
    </div>
  </div>
);

export default OntologyDeviceMethodsListItem;
