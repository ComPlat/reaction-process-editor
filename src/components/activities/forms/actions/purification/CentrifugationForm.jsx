import React, { useEffect } from 'react'

import MetricsInputFormGroup from '../../formgroups/MetricsInputFormGroup';

import MetricsDecorator from '../../../../../decorators/MetricsDecorator';

import FormSection from "../../../../utilities/FormSection";

import { centrifugationFormMetricNames } from '../../../../../constants/formMetrics';

const CentrifugationForm = (
  {
    workup,
    preconditions,
    onWorkupChange,
  }) => {

  useEffect(() => {
    centrifugationFormMetricNames.forEach(metricName => {
      const unit =
        workup[metricName]?.unit ||
        preconditions[metricName]?.unit ||
        MetricsDecorator.defaultUnit(metricName);

      let value = workup[metricName]?.value;
      value = value === 0 ? 0 : value || preconditions[metricName]?.value;

      if (value || value === 0) {
        onWorkupChange({
          name: metricName,
          value: { value: value, unit: unit },
        });
      }
    });
    // eslint-disable-next-line
  }, []);

  const handleWorkupChange = (name) => (value) => {
    onWorkupChange({ name: name, value: value })
  }

  const renderConditionInputs = () => {
    return centrifugationFormMetricNames.map((metricName) => {
      return (
        <MetricsInputFormGroup
          key={metricName}
          metricName={metricName}
          amount={workup[metricName]}
          onChange={handleWorkupChange(metricName)}
        />
      );
    });
  };

  return (
    <>
      <FormSection type='action'>
        {renderConditionInputs()}
      </FormSection>
    </>
  )
}

export default CentrifugationForm
