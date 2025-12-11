import React, { useContext, useEffect } from 'react'

import ButtonGroupToggle from '../../formgroups/ButtonGroupToggle';
import MetricsInputFormGroup from '../../formgroups/MetricsInputFormGroup';

import MetricsDecorator from '../../../../../decorators/MetricsDecorator';

import FormSection from "../../../../utilities/FormSection";

import { SelectOptions } from '../../../../../contexts/SelectOptions';

import { centrifugationFormMetricNames } from '../../../../../constants/formMetrics';

const CentrifugationForm = (
  {
    workup,
    preconditions,
    onWorkupChange,
  }) => {

  const centrifugationOptions = useContext(SelectOptions).FORMS.CENTRIFUGATION

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
        <>
          <MetricsInputFormGroup
            key={metricName}
            metricName={metricName}
            amount={workup[metricName]}
            onChange={handleWorkupChange(metricName)}
          />
        </>
      );
    });
  };

  return (
    <>
      <FormSection type='action'>
        <ButtonGroupToggle
          value={workup.automation_mode}
          options={centrifugationOptions.automation_modes}
          onChange={handleWorkupChange('automation_mode')}
          label='Automation'
        />
        {renderConditionInputs()}
      </FormSection>
    </>
  )
}

export default CentrifugationForm
