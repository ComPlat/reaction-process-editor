import React, { useContext } from 'react'

import ActivityForm from "../ActivityForm";
import MetricFormGroup from "./MetricFormGroup";

import DeviceMethodFormSet from '../formsets/DeviceMethodFormSet.jsx';
import OptionalFormSet from '../formsets/OptionalFormSet.jsx';

import { conditionFormMetricNames } from "../../../../constants/formMetrics.jsx";

import { SelectOptions } from '../../../../contexts/SelectOptions';

import OntologiesOptionsDecorator from '../../../../decorators/OntologiesOptionsDecorator.jsx';

const ConditionForm = (
  {
    activity,
    preconditions,
    onSave,
    onCancel,
    onWorkupChange,
    onChangeDuration,
    processStep,
  }) => {

  let ontologies = useContext(SelectOptions).ontologies
  const workup = activity.workup

  console.log(workup)
  const deviceMethodSummary = workup.device
    ? OntologiesOptionsDecorator.labelForOntologyId({ontologyId: workup.device, ontologies: ontologies}) +
      " " +
      (workup.method || "")
    : "";

  return (
    <ActivityForm
      type='condition'
      activity={activity}
      onSave={onSave}
      onCancel={onCancel}
      onWorkupChange={onWorkupChange}
      onChangeDuration={onChangeDuration}
      automationMode={processStep?.automation_mode}
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
