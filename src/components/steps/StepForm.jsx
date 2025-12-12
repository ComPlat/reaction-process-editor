import React, { useState } from "react";

import AutoComplete from "../activities/forms/formgroups/AutoComplete";
import FormButtons from "../utilities/FormButtons";
import VesselableFormSection from "../vesselables/VesselableFormSection";
import StepAutomationStatusFormGroup from "../activities/forms/formgroups/StepAutomationStatusFormGroup";
import { useActivityValidator } from "../../validators/ActivityValidator";

const StepForm = ({ processStep, previousStep, nameSuggestionOptions, onSave, onCancel, initialSampleVessel }) => {

  const [stepName, setStepName] = useState(processStep?.name || "");
  const [automationStatus, setAutomationStatus] = useState(processStep?.automation_status);
  const [reactionProcessVessel, setReactionProcessVessel] = useState(processStep?.reaction_process_vessel);

  const activityValidator = useActivityValidator();

  const handleSave = () => {
    if (activityValidator.validateStep(stepName, reactionProcessVessel, automationStatus)) {
      onSave(stepName, reactionProcessVessel, automationStatus);
    }
  };

  return (
    <>
      <AutoComplete
        options={nameSuggestionOptions.map((option) => option.label)}
        value={stepName}
        onChange={setStepName}
        domId="step-name-input"
        label="Name"
      />
      <VesselableFormSection
        onChange={setReactionProcessVessel}
        reactionProcessVessel={reactionProcessVessel}
        initialSampleVessel={initialSampleVessel}
        reactionProcessVesselSuggestion={previousStep?.reaction_process_vessel}
        typeColor="step"
        label={"Step" + (stepName ? ' "' + stepName + '"' : "")}
      />
      {processStep?.id && <StepAutomationStatusFormGroup
        modelId={processStep?.id}
        status={automationStatus || processStep?.step_automation_status}
        onChange={setAutomationStatus}
      />}
      <FormButtons
        onSave={handleSave}
        onCancel={onCancel}
        type="step"
      />
    </>
  );
};

export default StepForm;
