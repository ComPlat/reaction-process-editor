import React, { useContext, useEffect, useState } from "react";

import { FormGroup, Label } from 'reactstrap';

import ButtonGroupToggle from "../activities/forms/formgroups/ButtonGroupToggle";

import AutoComplete from "../activities/forms/formgroups/AutoComplete";
import FormButtons from "../utilities/FormButtons";
import VesselableFormSection from "../vesselables/VesselableFormSection";
import AutomationControlFormGroup from "../activities/forms/formgroups/AutomationControlFormGroup";

import { useActivityValidator } from "../../validators/ActivityValidator";

import AutomationControlDecorator from "../../decorators/AutomationControlDecorator";
import OntologiesDecorator from '../../decorators/OntologiesDecorator';

import { OntologyConstants } from "../../constants/OntologyConstants";

import { SelectOptions } from "../../contexts/SelectOptions";

const StepForm = ({ processStep, previousStep, nameSuggestionOptions, onSave, onCancel, initialSampleVessel }) => {

  let ontologies = useContext(SelectOptions).ontologies
  const [stepForm, setStepForm] = useState(processStep || {})
  const activityValidator = useActivityValidator();

  useEffect(() => {
    stepForm.automation_control ||
      setStepForm({ ...stepForm, automation_control: AutomationControlDecorator.defaultStepAutomationControl })

    stepForm.automation_mode ||
      setStepForm({ ...stepForm, automation_mode: OntologyConstants.automation_mode.automated })
  }, [stepForm])

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

  const ontologiesByRoleName = (roleName) => OntologiesDecorator.activeOptionsForRoleName({ roleName: roleName, options: ontologies })

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
          onChange={handleChange('automation_mode')} />
      </FormGroup>
      <VesselableFormSection
        onChange={handleChange('reaction_process_vessel')}
        reactionProcessVessel={stepForm.reaction_process_vessel}
        previousStepVessel={previousStep?.reaction_process_vessel}
        initialSampleVessel={initialSampleVessel}
        suggestPreviousVessel={stepForm.position > 0}
        suggestInitialVessel
        typeColor="step"
        automationMode={stepForm.automation_mode}
      />
      <AutomationControlFormGroup
        automationControl={stepForm.automation_control}
        onChange={handleChange('automation_control')}
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
