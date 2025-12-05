import React, { useEffect, useContext } from 'react'

import ActivityForm from "../ActivityForm.jsx";
import OntologiesMetricFormGroup from "./OntologiesMetricFormGroup.jsx";

import DeviceMethodFormSet from '../formsets/DeviceMethodFormSet.jsx';
import OptionalFormSet from '../formsets/OptionalFormSet.jsx';

// import { conditionFormMetricNames } from "../../../../constants/formMetrics.jsx";
import { ONTOLOGIES } from '../../../../constants/ontologies.js';
import { SelectOptions } from '../../../../contexts/SelectOptions.jsx';

import OntologiesDecorator from '../../../../decorators/OntologiesDecorator.jsx';


const OntologiesConditionForm = (
  {
    activity,
    preconditions,
    onSave,
    onCancel,
    onWorkupChange,
    onChangeDuration,
  }) => {

  useEffect(() => {
    onWorkupChange({ name: 'condition', value: ONTOLOGIES.class.CONDITION })
    // eslint-disable-next-line
  }, [])

  let ontologies = useContext(SelectOptions).ontologies

  let selectableOptionsMatchingWorkupDependencies =
    OntologiesDecorator.selectableOptionsMatchingWorkupDependencies(
      { ontologies: ontologies, roleName: 'class', workup: activity.workup, key: Math.random(10000) }
    )

  let conditionFormMetricNames = selectableOptionsMatchingWorkupDependencies.map(o => o.label.toUpperCase())

  console.log("conditionFormMetricNames")
  console.log(conditionFormMetricNames)

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
        selectableOptionsMatchingWorkupDependencies.map((metric) => (
          <OntologiesMetricFormGroup
            key={metric}
            ontologyId={metric.ontology_id}
            metricName={metric.label.toUpperCase()}
            precondition={preconditions[metric.label.toUpperCase()]}
            workup={activity.workup}
            onWorkupChange={onWorkupChange}
          />)
        )
      }
    </ActivityForm >
  )
}

export default OntologiesConditionForm
