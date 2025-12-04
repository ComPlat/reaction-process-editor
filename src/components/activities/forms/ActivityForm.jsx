import React, { useContext, useEffect, useState } from 'react'
import { Form } from 'reactstrap'
import PropTypes from 'prop-types'

import ApplyExtraEquipmentFormSet from './formsets/ApplyExtraEquipmentFormSet';
import TextInputFormSet from './formsets/TextInputFormSet';
import FormButtons from "../../utilities/FormButtons";
import AutomationStatusFormGroup from './formgroups/AutomationStatusFormGroup';
import Timer from '../timing/Timer';

import { SubFormController } from '../../../contexts/SubFormController';
import { StepLock } from '../../../contexts/StepLock';

const ActivityForm = (
  {
    type,
    activity,
    children,
    onCancel,
    onSave,
    onWorkupChange,
    onChangeDuration,
    className = ''
  }) => {

  const subFormController = useContext(SubFormController)
  const stepLock = useContext(StepLock)

  const [disabled, setDisabled] = useState(false)
  const workup = activity.workup

  useEffect(() => {
    setDisabled(subFormController.anyBlockingSubformOpen())
  }, [subFormController, activity, activity.workup])

  const handleWorkupChange = (key) => (value) => {
    onWorkupChange({ name: key, value: value });
  };

  return (
    <Form className={'activity-form ' + type + '-form ' + className}>
      {children}
      <ApplyExtraEquipmentFormSet
        activityType={type}
        actionName={activity.activity_name}
        workup={workup}
        onWorkupChange={onWorkupChange}
      />
      <TextInputFormSet
        label="Description"
        value={workup?.description}
        onSave={handleWorkupChange('description')}
        typeColor={type}
      />
      <Timer
        activityType={type}
        workup={workup}
        onChangeDuration={onChangeDuration}
        onWorkupChange={onWorkupChange}
        displayMode={'form'}
      />
      <AutomationStatusFormGroup
        activity={activity}
        status={workup['AUTOMATION_STATUS']}
        modelId={activity.id}
        onChange={handleWorkupChange('AUTOMATION_STATUS')}
        onResolvePooling={handleWorkupChange('fractions')}
      />
      <FormButtons
        onSave={onSave}
        onCancel={onCancel}
        disabled={disabled}
        disableSave={stepLock}
        saveLabel={stepLock ? 'Step is locked' : "Save"}
        type={type}
      >
      </FormButtons>
    </Form>
  )
}

ActivityForm.propTypes = {
  activity: PropTypes.object.isRequired
}

export default ActivityForm
