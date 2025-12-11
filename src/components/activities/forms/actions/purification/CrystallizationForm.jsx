import React, { useContext, useEffect } from 'react'
import { FormGroup } from 'reactstrap'

import ButtonGroupToggle from '../../formgroups/ButtonGroupToggle';
import DurationSelection from '../../formgroups/DurationSelection';
import FormSection from "../../../../utilities/FormSection";
import MetricsInputFormGroup from '../../formgroups/MetricsInputFormGroup';
import SolventListFormGroup from '../../formgroups/SolventListFormGroup';

import { SelectOptions } from '../../../../../contexts/SelectOptions';

const CrystallizationForm = (
  {
    workup,
    preconditions,
    onWorkupChange,
  }) => {

  const solvents = workup['purification_steps']?.[0]?.solvents || []
  const amount = workup.amount || { value: 0, unit: 'ml' }

  const crystallizationOptions = useContext(SelectOptions).FORMS.CRYSTALLIZATION

  useEffect(() => {
    workup.automation_mode ||
      onWorkupChange({ name: 'automation_mode', value: crystallizationOptions.automation_modes[0].value })
    workup.TEMPERATURE ||
      onWorkupChange({ name: 'TEMPERATURE', value: preconditions.TEMPERATURE })
    workup.crystallization_mode ||
      onWorkupChange({ name: 'crystallization_mode', value: crystallizationOptions.modes[0]['value'] })
    workup.heating_duration ||
      onWorkupChange({ name: 'heating_duration', value: 0 })
    workup.cooling_duration ||
      onWorkupChange({ name: 'cooling_duration', value: 0 })
    // eslint-disable-next-line
  }, [])

  const handleWorkupChange = (workupKey) => (value) => onWorkupChange({ name: workupKey, value: value })

  // Crystallization is the only 1 of 4 the purification types having no actual purification_steps. For consistentency we mimic
  // their behaiour by wrapping the crystallizatin in an array `purification_steps` with exactly 1 step. cbuggle, 01.07.2024.
  const handleSolventsChange = (solvents) => onWorkupChange({ name: 'purification_steps', value: [{ solvents: solvents }] })

  return (
    <>
      <FormSection type='action'>
        <ButtonGroupToggle
          value={workup.automation_mode}
          options={crystallizationOptions.automation_modes}
          onChange={selectedValue => onWorkupChange({ name: 'automation_mode', value: selectedValue })}
          label='Automation'
        />
      </FormSection>
      <FormSection type='action'>
        <FormGroup>
          <SolventListFormGroup
            solvents={solvents}
            solventOptions={crystallizationOptions.solvents}
            setSolvents={handleSolventsChange}
          />
        </FormGroup>
        <FormGroup>
          <MetricsInputFormGroup
            metricName={'VOLUME'}
            amount={amount}
            onChange={handleWorkupChange('amount')}
          />
        </FormGroup>
        <FormGroup>
          <MetricsInputFormGroup
            metricName={'TEMPERATURE'}
            amount={workup.TEMPERATURE}
            onChange={handleWorkupChange('TEMPERATURE')}
          />
        </FormGroup>
        <FormGroup>
          <DurationSelection
            label="Heating"
            duration={workup.heating_duration}
            onChangeDuration={handleWorkupChange('heating_duration')}
          />
        </FormGroup>
        <FormGroup>
          <DurationSelection
            label="Cooling"
            duration={workup.cooling_duration}
            onChangeDuration={handleWorkupChange('cooling_duration')}
          />
        </FormGroup>
        <ButtonGroupToggle
          label="Filtration"
          value={workup.crystallization_mode}
          options={crystallizationOptions.modes}
          onChange={handleWorkupChange('crystallization_mode')} />
      </FormSection>
    </>
  )
}

export default CrystallizationForm
