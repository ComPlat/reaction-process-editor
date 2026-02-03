import React, { useContext, useEffect, useState } from 'react'
import { Form, FormGroup } from 'reactstrap'
import PropTypes from 'prop-types'

import ApplyExtraEquipmentFormSet from './formsets/ApplyExtraEquipmentFormSet';
import TextInputFormSet from './formsets/TextInputFormSet';
import FormButtons from "../../utilities/FormButtons";
import AutomationControlFormGroup from './formgroups/AutomationControlFormGroup';
import Timer from '../timing/Timer';

import { OntologyConstants } from '../../../constants/OntologyConstants';

import { SubFormController } from '../../../contexts/SubFormController';
import { StepLock } from '../../../contexts/StepLock';

import ChromatographyPoolingFormModal from '../../utilities/ChromatographyPoolingFormModal';
import AutomationControlDecorator from '../../../decorators/AutomationControlDecorator';

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

  const currentAutomationControl = workup.automation_control || {}
  const currentAutomationStatus = AutomationControlDecorator.automationStatusByName(currentAutomationControl.status)
    || AutomationControlDecorator.defaultAutomationStatus

  useEffect(() => {
    setDisabled(subFormController.anyBlockingSubformOpen())
  }, [subFormController, activity, activity.workup])

  useEffect(() => {
    workup.automation_control ||
      onWorkupChange({ name: 'automation_control', value: AutomationControlDecorator.defaultAutomationControl })
    // eslint-disable-next-line
  }, [workup.automation_control])


  const handleWorkupChange = (key) => (value) => {
    onWorkupChange({ name: key, value: value });
  };

  return (
    <Form className={'activity-form ' + type + '-form ' + className}>
      {children}
      {
        <ApplyExtraEquipmentFormSet
          activityType={type}
          actionName={activity.activity_name}
          workup={workup}
          onWorkupChange={onWorkupChange}
          disabled={OntologyConstants.isAutomated(workup.automation_mode)}
        />
      }
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
      <AutomationControlFormGroup
        automationControl={currentAutomationControl}
        onChange={handleWorkupChange('automation_control')}
      />
      {currentAutomationStatus?.needsManualResolve &&
        <FormGroup className={"form-section"}>
          <ChromatographyPoolingFormModal
            activity={activity}
            onResolvePooling={handleWorkupChange('fractions')}
          />
        </FormGroup>
      }
      <FormButtons
        onSave={onSave}
        onCancel={onCancel}
        disabled={disabled}
        disableSave={stepLock}
        saveLabel={stepLock ? 'Step is locked' : "Save"}
        type={type}
      >
      </FormButtons>
    </Form >
  )
}

ActivityForm.propTypes = {
  activity: PropTypes.object.isRequired
}

export default ActivityForm
