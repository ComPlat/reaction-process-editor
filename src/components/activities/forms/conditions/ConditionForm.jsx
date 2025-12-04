import React from 'react'

import ActivityForm from "../ActivityForm";
import MetricFormGroup from "./MetricFormGroup";

import DeviceMethodFormSet from '../formsets/DeviceMethodFormSet.jsx';
import OptionalFormSet from '../formsets/OptionalFormSet.jsx';

import { conditionFormMetricNames } from "../../../../constants/formMetrics.jsx";

const ConditionForm = (
  {
    activity,
    preconditions,
    onSave,
    onCancel,
    onWorkupChange,
    onChangeDuration,
  }) => {

  const workup = activity.workup
  const deviceMethodSummary = workup.device ?
    workup.device + ' ' + (workup.method || '')
    : ""

  return (
    <ActivityForm
      type='condition'
      activity={activity}
      onSave={onSave}
      onCancel={onCancel}
      onWorkupChange={onWorkupChange}
      onChangeDuration={onChangeDuration}
    >
      <OptionalFormSet
        subFormLabel={"Device & Method"}
        valueSummary={deviceMethodSummary}
        onSave={onWorkupChange}
        onCancel={onCancel}
        isEqualToPredefinedValue={!workup.device}
        typeColor={"condition"}
      >
        <DeviceMethodFormSet
          activity={activity}
          onWorkupChange={onWorkupChange} />
      </OptionalFormSet>
      {
        conditionFormMetricNames.map((metricName) => (
          <MetricFormGroup
            key={metricName}
            metricName={metricName}
            precondition={preconditions[metricName]}
            workup={activity.workup}
            onWorkupChange={onWorkupChange}
          />)
        )
      }
    </ActivityForm >
  )
}

export default ConditionForm
