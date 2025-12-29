import React, { useContext } from 'react'

import AmountInputSet from '../../../../utilities/AmountInputSet'

import FormSection from '../../../../utilities/FormSection'

import Select from 'react-select'

import SingleLineFormGroup from '../../formgroups/SingleLineFormGroup'

import { StepSelectOptions } from '../../../../../contexts/StepSelectOptions'
import RemoveSolventListFormSection from './RemoveSolventListFormSection'

const RemoveFromFractionForm = ({ workup, onWorkupChange }) => {
	const removableFractionsOptions = useContext(StepSelectOptions).FORMS.EVAPORATION.removable_samples[workup.origin_type]

	const handleRemoveFractionChange = (fraction) => {
		onWorkupChange({ name: 'samples', value: [fraction] });
	}

	const handleWorkupChange = (name) => (value) => {
		onWorkupChange({ name: name, value: value });
	}

	return (
		<>
			<FormSection type='action'>
				<SingleLineFormGroup label={'Fraction'}>
					<Select
						className="react-select--overwrite"
						classNamePrefix="react-select"
						name="samples"
						options={removableFractionsOptions}
						value={workup.samples?.[0]}
						onChange={handleRemoveFractionChange}
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

export default RemoveFromFractionForm
