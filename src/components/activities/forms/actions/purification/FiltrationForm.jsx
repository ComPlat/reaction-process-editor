import React, { useContext } from 'react'

import ButtonGroupToggle from "../../formgroups/ButtonGroupToggle";
import CreateButton from "../../../../utilities/CreateButton";
import FiltrationStepForm from "./FiltrationStepForm";
import FormSection from '../../../../utilities/FormSection'

import { SelectOptions } from '../../../../../contexts/SelectOptions';

import withActivitySteps from '../../../../utilities/WithActivitySteps';
import VesselableFormSection from '../../../../vesselables/VesselableFormSection';

const FiltrationForm = (
  {
    workup,
    onWorkupChange,
    activitySteps,
    showNewStepForm,
    addStep,
    reactionProcessVessel,
    onChangeVessel,
    onSaveStep,
    onCancelStep,
    onDeleteStep
  }) => {

  const filtrationOptions = useContext(SelectOptions).FORMS.FILTRATION

  const renderFilterMethodToggle = () => {
    return (
      <ButtonGroupToggle
        value={workup.filtration_mode}
        options={filtrationOptions.modes}
        onChange={selectedValue => onWorkupChange({ name: 'filtration_mode', value: selectedValue })}
        label='Keep'
      />
    )
  }

  const renderAutomationToggle = () => {
    return (
      <ButtonGroupToggle
        value={workup.automation_mode}
        options={filtrationOptions.automation_modes}
        onChange={selectedValue => onWorkupChange({ name: 'automation_mode', value: selectedValue })}
        label='Automation'
      />
    )
  }

  return (
    <>
      <FormSection type='action'>
        <VesselableFormSection
          onChange={onChangeVessel}
          reactionProcessVessel={reactionProcessVessel}
        />
        {renderFilterMethodToggle()}
        {renderAutomationToggle()}
      </FormSection>
      {activitySteps.map((step, idx) =>
        <FiltrationStepForm
          key={'filtration-step-' + idx + '-' + activitySteps.length}
          label={'Filtration Step ' + (idx + 1)}
          workup={step}
          onSave={onSaveStep(idx)}
          onCancel={onCancelStep(idx)}
          onDelete={onDeleteStep(idx)}
          canDelete={activitySteps.length > 1}
        />
      )}
      {showNewStepForm &&
        <FiltrationStepForm
          label={'Filtration Step ' + (activitySteps.length + 1)}
          workup={activitySteps.at(-1) || {}}
          initialShowForm={true}
          onSave={onSaveStep(activitySteps.length)}
          onCancel={onCancelStep(activitySteps.lengthx)}
        />
      }
      <FormSection type='action'>
        <CreateButton
          label='Filtration Step'
          type='action'
          onClick={addStep}
          size='sm'
        />
      </FormSection>
    </>
  )
}

export default withActivitySteps(FiltrationForm, 'purification_steps')
