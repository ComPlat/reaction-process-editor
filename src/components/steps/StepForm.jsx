import React, { useContext, useState } from "react";

import { FormGroup, Label } from 'reactstrap';

import ButtonGroupToggle from "../activities/forms/formgroups/ButtonGroupToggle";

import AutoComplete from "../activities/forms/formgroups/AutoComplete";
import FormButtons from "../utilities/FormButtons";
import VesselableFormSection from "../vesselables/VesselableFormSection";
import StepAutomationStatusFormGroup from "../activities/forms/formgroups/StepAutomationStatusFormGroup";
import { useActivityValidator } from "../../validators/ActivityValidator";

import OntologiesDecorator from '../../decorators/OntologiesDecorator';

import { OntologyConstants } from "../../constants/OntologyConstants";

import { SelectOptions } from "../../contexts/SelectOptions";

const StepForm = ({ processStep, previousStep, nameSuggestionOptions, onSave, onCancel, initialSampleVessel }) => {

  let ontologies = useContext(SelectOptions).ontologies
  const [stepForm, setStepForm] = useState(processStep || { name: "", automation_mode: OntologyConstants.automation_mode.automated })
  const activityValidator = useActivityValidator();

  const handleSave = () => {
    if (stepForm === processStep) {
      onCancel()
    } else {
      activityValidator.validateStep(stepForm) && onSave(stepForm)
    }
  }

  const handleChange = (attribute) => (value) => {
    setStepForm({ ...stepForm, [attribute]: value })
  }

  const handleChangeAutomationMode = (newMode) => {
    let newStatus = OntologyConstants.isAutomated(newMode) ?
      processStep?.actual_automation_status : ""

    setStepForm({
      ...stepForm,
      automation_mode: newMode,
      automation_status: newStatus,
      actual_automation_status: newStatus
    })
  }

  const handleChangeAutomationStatus = (newStatus) => {
    setStepForm({
      ...stepForm,
      automation_status: newStatus,
      actual_automation_status: newStatus
    })
  }

  const ontologiesByRoleName = (roleName) => OntologiesDecorator.activeOptionsForRoleName({ roleName: roleName, options: ontologies })

  // const displayAutomationStatus =
  //   stepForm.actual_automation_status

  return (
    <>
      <AutoComplete
        options={nameSuggestionOptions.map((option) => option.label)}
        value={stepForm.name}
        onChange={handleChange('name')}
        domId="step-name-input"
        label="Name"
      />
      <FormGroup className='row gx-2 pt-1'>
        <Label>Mode</Label>
        <ButtonGroupToggle
          value={stepForm.automation_mode}
          options={ontologiesByRoleName('automation_mode')}
          onChange={handleChangeAutomationMode} />
      </FormGroup>
      {OntologyConstants.isAutomated(stepForm.automation_mode) &&
        <StepAutomationStatusFormGroup
          key={stepForm.actual_automation_status}
          modelId={stepForm.id}
          status={stepForm.actual_automation_status}
          onChange={handleChangeAutomationStatus}
        />
      }
      <VesselableFormSection
        onChange={handleChange('reaction_process_vessel')}
        reactionProcessVessel={stepForm.reaction_process_vessel}
        initialSampleVessel={initialSampleVessel}
        previousStepVessel={previousStep?.reaction_process_vessel}
        typeColor="step"
        label={"Step" + (stepForm.name ? ' "' + stepForm.name + '"' : "")}
        automationMode={stepForm.automation_mode}
      />
      <FormButtons
        onSave={handleSave}
        onCancel={onCancel}
        type="step"
      />
    </>
  );
};

export default StepForm;
