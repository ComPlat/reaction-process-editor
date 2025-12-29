import React, { useContext } from "react";

import ExtractionStepForm from "./ExtractionStepForm";

import ButtonGroupToggle from "../../formgroups/ButtonGroupToggle";
import CreateButton from "../../../../utilities/CreateButton";
import FormSection from "../../../../utilities/FormSection";

import { SelectOptions } from "../../../../../contexts/SelectOptions";

import withActivitySteps from "../../../../utilities/WithActivitySteps";

const ExtractionForm = ({
  workup,
  onWorkupChange,
  activitySteps,
  showNewStepForm,
  addStep,
  onSaveStep,
  onCancelStep,
  onDeleteStep
}) => {
  const extractionOptions = useContext(SelectOptions).FORMS.EXTRACTION;

  const renderPhaseToggle = () => {
    return (
      <ButtonGroupToggle
        value={workup.phase}
        options={extractionOptions.phases}
        onChange={(selectedValue) =>
          onWorkupChange({ name: "phase", value: selectedValue })
        }
        label="Retain phase"
      />
    )
  }

  return (
    <>
      <FormSection type="action">
        {renderPhaseToggle()}
      </FormSection>

      {activitySteps.map((step, idx) =>
        <ExtractionStepForm
          key={'extraction-step-' + idx + '-' + activitySteps.length}
          label={"Extraction Step " + (idx + 1)}
          workup={step}
          onSave={onSaveStep(idx)}
          onCancel={onCancelStep(idx)}
          onDelete={onDeleteStep(idx)}
          canDelete={activitySteps.length > 1}
        />
      )}

      {showNewStepForm &&
        <ExtractionStepForm
          label={"Extraction Step " + (activitySteps.length + 1)}
          workup={activitySteps.at(-1) || {}}
          initialShowForm={true}
          onSave={onSaveStep(activitySteps.length)}
          onCancel={onCancelStep(activitySteps.length)}
        />
      }
      <FormSection type='action'>
        <CreateButton
          label='Extraction Step'
          type='action'
          onClick={addStep}
          size='sm'
        />
      </FormSection>
    </>
  );
};


export default withActivitySteps(ExtractionForm, 'purification_steps');
