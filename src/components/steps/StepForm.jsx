import React, { useContext, useState } from "react";

import { FormGroup, Label } from 'reactstrap';

import AutoComplete from "../activities/forms/formgroups/AutoComplete";
import AutomationControlFormGroup from "../activities/forms/formgroups/AutomationControlFormGroup";
import ButtonGroupToggle from "../activities/forms/formgroups/ButtonGroupToggle";

import FormButtons from "../utilities/FormButtons";
import VesselableFormSection from "../vesselables/VesselableFormSection";

import { useActivityValidator } from "../../validators/ActivityValidator";

import AutomationControlDecorator from "../../decorators/AutomationControlDecorator";
import OntologiesOptionsDecorator from '../../decorators/OntologiesOptionsDecorator';

import { notifications } from '../../constants/translations';

import { SelectOptions } from "../../contexts/SelectOptions";
import NotificationContext from "../../contexts/NotificationContext";


const StepForm = ({ processStep, reactionProcess, previousStep, nameSuggestionOptions, onSave, onCancel, initialSampleVessel }) => {

  const { addNotification } = useContext(NotificationContext);

  const emptyStepForm = {
    name: '',
    automation_mode: reactionProcess.initial_conditions.automation_mode,
    automation_control: AutomationControlDecorator.defaultStepAutomationControl
  }

  let ontologies = useContext(SelectOptions).ontologies
  const [stepForm, setStepForm] = useState(processStep || emptyStepForm)
  const activityValidator = useActivityValidator();


  const handleSave = () => {
    if (stepForm === processStep) {
      onCancel()
    } else {
      activityValidator.validateStep(stepForm) && onSave(stepForm)

      if (!!processStep) {
        stepForm.automation_mode === processStep.automation_mode
          || addNotification(notifications.automation_mode.has_been_changed)
      }
    }
  }


  const handleChange = (attribute) => (value) => {
    setStepForm({ ...stepForm, [attribute]: value })
  }

  const ontologiesByRoleName = (roleName) => OntologiesOptionsDecorator.activeOptionsForRoleName({ roleName: roleName, options: ontologies })

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
