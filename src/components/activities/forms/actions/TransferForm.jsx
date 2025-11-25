import React, { useContext } from 'react'
import Select from 'react-select'

import AmountInputSet from '../../../utilities/AmountInputSet';
import SingleLineFormGroup from "../formgroups/SingleLineFormGroup";

import OptionsDecorator from '../../../../decorators/OptionsDecorator';
import SamplesDecorator from '../../../../decorators/SamplesDecorator';

import { SelectOptions } from '../../../../contexts/SelectOptions';
import FormSection from "../../../utilities/FormSection";

const TransferForm = (
  {
    workup,
    onWorkupChange,
    isPersisted,
  }) => {

  const transferOptions = useContext(SelectOptions).FORMS.TRANSFER
  const sampleOptions = transferOptions.transferable_samples

  const currentSample = OptionsDecorator.optionForValue(workup['sample_id'], sampleOptions)
  const currentTarget = OptionsDecorator.optionForValue(workup['transfer_target_step_id'], transferOptions.targets)

  var transferToOptions = transferOptions.targets
    .filter(transferTarget => !transferTarget.saved_sample_ids.includes(currentSample?.id))

  const handleSampleChange = ({ value, label }) => {
    // We have a chance of collisions on sampleID as we are coping with 2 different ActiveRecord models
    // with integer id (Solvent, DiverseSolvent; MediumSamples have uuid).
    let newSample = sampleOptions.find(sample => sample.value === value && sample.label === label)
    if (newSample) {
      onWorkupChange({ name: 'acts_as', value: newSample.acts_as })
      onWorkupChange({ name: 'sample_id', value: newSample.value })
      newSample?.amount?.value && onWorkupChange({ name: 'target_amount', value: { ...newSample.amount, ...{ percentage: 100 } } })
      onWorkupChange({ name: 'sample_original_amount', value: newSample.amount })
    }

    if (currentTarget && currentTarget.saved_sample_ids.includes(newSample.id)) {
      onWorkupChange({ name: 'transfer_target_step_id', value: undefined })
    }
  }

  const handleChangeTarget = (target_step_id) => {
    onWorkupChange({ name: 'transfer_target_step_id', value: target_step_id })

    let newTarget = OptionsDecorator.optionForValue(target_step_id, transferOptions.targets)

    if (newTarget && newTarget.saved_sample_ids.includes(workup['sample_id'])) {
      onWorkupChange({ name: 'sample_id', value: undefined })
    }
  }

  const handleChangeAmount = (amount) => onWorkupChange({ name: "target_amount", value: amount })

  return (
    <FormSection type='action'>
      <SingleLineFormGroup label='Transfer Sample'>
        <Select
          key={"sample" + currentSample?.value}
          className="react-select--overwrite"
          classNamePrefix="react-select"
          name="sample_id"
          options={sampleOptions}
          value={currentSample}
          onChange={handleSampleChange}
          isDisabled={isPersisted}
        />
      </SingleLineFormGroup>
      <SingleLineFormGroup label='Transfer to Step'>
        <Select
          key={"target" + currentTarget?.value}
          name="transfer_target_step_id"
          className="react-select--overwrite"
          classNamePrefix="react-select"
          options={transferToOptions}
          value={currentTarget}
          onChange={selectedOption => handleChangeTarget(selectedOption.value)}
          isDisabled={isPersisted}
        />
      </SingleLineFormGroup>

      {/* Setting label even though initially/usually/most saved Samples have no sampleSvgImg */}
      <SingleLineFormGroup label={SamplesDecorator.sampleSvgImg(currentSample)}>
        {currentSample && SamplesDecorator.infoAvailableAmounts(currentSample['unit_amounts'])}
      </SingleLineFormGroup>

      <AmountInputSet
        amount={workup['target_amount']}
        maxAmounts={currentSample?.unit_amounts}
        onChangeAmount={handleChangeAmount}
      />
    </FormSection>
  )
}

export default TransferForm
