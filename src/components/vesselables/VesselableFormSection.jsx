import React, { useContext } from "react";
import Select from "react-select";
import MultiInputFormGroup from "../activities/forms/formgroups/MultiInputFormGroup";
import SingleLineFormGroup from "../activities/forms/formgroups/SingleLineFormGroup";
import VesselableSelector from "../vesselables/VesselableSelector";
import VesselableDecorator from "../../decorators/VesselableDecorator";
import VesselableQuickSelector from "./VesselableQuickSelector";

import { SelectOptions } from "../../contexts/SelectOptions";
import { VesselOptions } from "../../contexts/VesselOptions";
import OptionsDecorator from "../../decorators/OptionsDecorator";
import { Button } from "reactstrap";

const VesselableFormSection = ({
  onChange,
  reactionProcessVessel,
  previousStepVessel,
  initialSampleVessel,
  typeColor,
}) => {
  const selectOptions = useContext(SelectOptions);
  const vesselables = useContext(VesselOptions);

  const preparationOptions = selectOptions.vessel_preparations;

  const currentVesselable = VesselableDecorator.getVesselableByParams(
    { vesselable_id: reactionProcessVessel?.vesselable_id, vesselable_type: reactionProcessVessel?.vesselable_type },
    vesselables)

  const assignVesselable = (vesselableParams) => {
    onChange(
      {
        ...reactionProcessVessel, // retain id & preparations
        ...vesselableParams
      }
    )
  };

  const handleSelectPreparations = (preparations) => {
    onChange({
      ...reactionProcessVessel,
      preparations: preparations,
    });
  };

  const handleSelectCleanup = (selected) => {
    onChange({
      ...reactionProcessVessel,
      cleanup: selected.value,
    });
  };

  const renderVesselSuggestion = () => {
    return (previousStepVessel ?
      <div className="d-flex justify-content-between align-self-center">
        <div className="col-form-label">
          {VesselableDecorator.vesselableSingleLine(previousStepVessel.vesselable)}
        </div>
        <div className="optional-form-group__open-controls">
          <div className="d-grid gap-2">
            <Button size={'sm'} color={'step'} onClick={() => onChange(previousStepVessel)} >
              Use Previous
            </Button>
          </div>
        </div>
      </div>
      : <></>
    )
  }
  const renderInitialSampleVesselSuggestion = () => {
    return (initialSampleVessel ?
      <div className="d-flex justify-content-between align-self-center">
        <div className="col-form-label">
          {VesselableDecorator.vesselableSingleLine(initialSampleVessel.vesselable)}
        </div>
        <div className="optional-form-group__open-controls">
          <div className="d-grid gap-2">
            <Button size={'sm'} color={'step'} onClick={() => onChange(initialSampleVessel)} >
              Use Initial
            </Button>
          </div>
        </div>
      </div >
      : <></>
    )
  }

  return (
    <>
      <MultiInputFormGroup label={VesselableDecorator.vesselableType(currentVesselable)} typeColor={typeColor}>
        <div className="pt-1 mb-3">
          {renderInitialSampleVesselSuggestion()}
        </div>
        <div className="pt-1 mb-3">
          {renderVesselSuggestion()}
        </div>
        <div className="pt-1 mb-3">
          <VesselableQuickSelector
            currentVesselable={currentVesselable}
            onSelectVesselable={assignVesselable}
            typeColor={typeColor}
          />
        </div>
        <div className="pt-1 mb-3">
          <VesselableSelector
            currentVesselable={currentVesselable}
            onSelectVesselable={assignVesselable}
            typeColor={typeColor}
            buttonLabel={!!reactionProcessVessel?.vesselable_id ? "Change" : "Set"}
          />
        </div>
        <SingleLineFormGroup label="Preparations:" typeColor={typeColor}>
          <Select
            className="react-select--overwrite"
            classNamePrefix="react-select"
            name="vesselable_preparations"
            isMulti
            isClearable={false}
            options={preparationOptions.preparation_types}
            value={OptionsDecorator.optionsForValues(reactionProcessVessel?.preparations, preparationOptions.preparation_types)}
            onChange={(selected) =>
              handleSelectPreparations(selected.map((option) => option.value))
            }
          />
        </SingleLineFormGroup>
        <SingleLineFormGroup label="Cleanup:" typeColor={typeColor}>
          <Select
            className="react-select--overwrite"
            classNamePrefix="react-select"
            name="vesselable_cleanup"
            options={preparationOptions.cleanup_types}
            value={OptionsDecorator.optionForValue(reactionProcessVessel?.cleanup, preparationOptions.cleanup_types)}
            onChange={handleSelectCleanup}
          />
        </SingleLineFormGroup>
      </MultiInputFormGroup>
    </>
  );
};

export default VesselableFormSection;
