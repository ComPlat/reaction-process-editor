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
  const currentSource = OptionsDecorator.optionForValue(workup['source_step_id'], transferOptions.targets)
  const currentTarget = OptionsDecorator.optionForValue(workup['target_step_id'], transferOptions.targets)


  const transferToOptions = transferOptions.targets
    .filter(transferTarget => transferTarget.value !== workup.source_step_id)
    .filter(transferTarget => !transferTarget.saved_sample_ids.includes(currentSample?.id))

  const transferFromOptions = transferOptions.targets

  const handleSampleChange = (sample) => {
    let [value, label] = [sample?.value, sample?.label]

    // We have a slight chance of collisions on sampleID as we are coping with 3 different ActiveRecord models, two
    // with integer id (Solvent, DiverseSolvent; MediumSamples have uuid).
    let newSample = sampleOptions.find(sample => sample?.value === value && sample?.label === label)
    if (newSample) {
      const sampleSource = transferOptions.targets.find(reactionStep => reactionStep.saved_sample_ids.includes(newSample.id))
      onWorkupChange({ name: 'acts_as', value: newSample.acts_as })
      onWorkupChange({ name: 'sample_id', value: newSample.value })
      onWorkupChange({ name: 'source_step_id', value: sampleSource?.value })
      onWorkupChange({ name: 'sample_original_amount', value: newSample.amount })
      newSample?.amount?.value && onWorkupChange({ name: 'target_amount', value: { ...newSample.amount, ...{ percentage: 100 } } })
    } else {
      onWorkupChange({ name: 'sample_id', value: undefined })
    }

    if (currentTarget?.saved_sample_ids?.includes(newSample?.id)) {
      onWorkupChange({ name: 'target_step_id', value: undefined })
    }
  }

  const handleTransferFromChange = (source_step) => {
    onWorkupChange({ name: 'acts_as', value: undefined })
    onWorkupChange({ name: 'sample_id', value: undefined })
    onWorkupChange({ name: 'target_amount', value: { percentage: 100 } })
    onWorkupChange({ name: 'source_step_id', value: source_step?.value })

    if (source_step?.value === workup.target_step_id) {
      onWorkupChange({ name: 'target_step_id', value: undefined })
    }
  }

  const handleChangeTarget = (target_step_id) => {
    let newTarget = OptionsDecorator.optionForValue(target_step_id, transferOptions.targets)

    onWorkupChange({ name: 'target_step_id', value: target_step_id })
    onWorkupChange({ name: 'automation_mode', value: newTarget?.automation_mode })

    if (newTarget && newTarget.saved_sample_ids.includes(workup['sample_id'])) {
      onWorkupChange({ name: 'sample_id', value: undefined })
    }
    if (newTarget?.id === workup.source_step_id) {
      onWorkupChange({ name: 'source_step_id', value: undefined })
    }
  }

  const handleChangeAmount = (amount) => onWorkupChange({ name: "target_amount", value: amount })

  return (
    <FormSection type='action'>
      <SingleLineFormGroup label='From Step'>
        <Select
          key={"source_step" + workup.source_step_id}
          className="react-select--overwrite"
          classNamePrefix="react-select"
          name="source_step_id"
          options={transferFromOptions}
          value={currentSource}
          onChange={handleTransferFromChange}
          isDisabled={isPersisted}
          placeholder={!currentSample ? "Select ..." : "Initial"}
          isClearable
        />
      </SingleLineFormGroup>
      <SingleLineFormGroup label='From Sample'>
        <Select
          key={"sample" + currentSample?.value}
          className="react-select--overwrite"
          classNamePrefix="react-select"
          name="sample_id"
          options={sampleOptions}
          value={currentSample}
          onChange={handleSampleChange}
          isDisabled={isPersisted}
          placeholder={!!currentSample ? "Select ..." : "Step End Product"}
          isClearable
        />
      </SingleLineFormGroup>
      <SingleLineFormGroup label='To Step'>
        <Select
          key={"target_step" + currentTarget?.value}
          name="target_step_id"
          className="react-select--overwrite"
          classNamePrefix="react-select"
          options={transferToOptions}
          value={currentTarget}
          onChange={selectedOption => handleChangeTarget(selectedOption?.value)}
          isDisabled={isPersisted}
          isClearable
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
