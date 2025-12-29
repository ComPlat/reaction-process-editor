import React, { useContext } from 'react'

import AmountInputSet from '../../../../utilities/AmountInputSet'

import FormSection from '../../../../utilities/FormSection'

import Select from 'react-select'

import SingleLineFormGroup from '../../formgroups/SingleLineFormGroup'

import { StepSelectOptions } from '../../../../../contexts/StepSelectOptions'
import RemoveSolventListFormSection from './RemoveSolventListFormSection'

const RemoveFromSampleForm = ({ workup, onWorkupChange }) => {
	const removableSamplesOptions = useContext(StepSelectOptions).FORMS.EVAPORATION.removable_samples[workup.origin_type]

	const handleSampleChange = (sample) => {
		onWorkupChange({ name: "samples", value: [sample] });
		onWorkupChange({ name: "amount", value: sample.amount });
		onWorkupChange({ name: "solvents", value: sample.solvents });
		onWorkupChange({ name: "solvents_amount", value: sample.solvents_amount });
	}

	const handleWorkupChange = (name) => (value) => {
		onWorkupChange({ name: name, value: value });
	}

	return (
		<>
			<FormSection type='action'>
				<SingleLineFormGroup label={'Sample'}>
					<Select
						className="react-select--overwrite"
						classNamePrefix="react-select"
						name="samples"
						options={removableSamplesOptions}
						value={workup.samples?.[0]}
						onChange={handleSampleChange}
					/>
				</SingleLineFormGroup>
			</FormSection>
			<FormSection>
				<AmountInputSet
					amount={workup.amount}
					onChangeAmount={handleWorkupChange('amount')} />
			</FormSection>
			<RemoveSolventListFormSection workup={workup} onWorkupChange={onWorkupChange} />
		</>
	)
}

export default RemoveFromSampleForm
