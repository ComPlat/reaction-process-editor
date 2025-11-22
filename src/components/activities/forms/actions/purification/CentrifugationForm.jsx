import React, { useContext } from 'react'

import ButtonGroupToggle from '../../formgroups/ButtonGroupToggle';
import FormSection from "../../../../utilities/FormSection";

import { SelectOptions } from '../../../../../contexts/SelectOptions';

const CentrifugationForm = (
  {
    workup,
    onWorkupChange,
  }) => {

  const centrifugationOptions = useContext(SelectOptions).FORMS.PURIFICATION.CENTRIFUGATION

  return (
    <>
      <FormSection type='action'>
        <ButtonGroupToggle
          value={workup.automation_mode}
          options={centrifugationOptions.automation_modes}
          onChange={selectedValue => onWorkupChange({ name: 'automation_mode', value: selectedValue })}
          label='Automation'
        />
      </FormSection>
    </>
  )
}

export default CentrifugationForm
