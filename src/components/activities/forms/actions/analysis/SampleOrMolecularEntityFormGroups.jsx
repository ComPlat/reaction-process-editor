import React from 'react';
import { FormGroup, Label } from 'reactstrap';

import SamplesIconSelect from '../../../../utilities/SamplesIconSelect';

const SampleOrMolecularEntityFormGroups = ({
  molecularEntities,
  molecularEntityOptions,
  onMolecularEntitiesChange,
  onSamplesChange,
  samples,
  sampleOptions,
}) => {
  const hasMolecularEntities = !!molecularEntities?.length;
  const hasSamples = !!samples?.length;
  const showMolecularEntities = !hasSamples || hasMolecularEntities;
  const showSamples = !hasMolecularEntities || hasSamples;

  return (
    <>
      {showSamples && (
        <FormGroup>
          <Label>Sample</Label>
          <SamplesIconSelect
            isMulti
            isClearable={false}
            options={sampleOptions}
            samples={samples}
            onChange={onSamplesChange}
          />
        </FormGroup>
      )}
      {showMolecularEntities && (
        <FormGroup>
          <Label>Molecular Entity</Label>
          <SamplesIconSelect
            isMulti
            isClearable={false}
            options={molecularEntityOptions}
            samples={molecularEntities}
            onChange={onMolecularEntitiesChange}
          />
        </FormGroup>
      )}
    </>
  );
};

export default SampleOrMolecularEntityFormGroups;
