import React, { useContext } from 'react'
import Select from 'react-select'

import RemoveSolventListFormSection from './RemoveSolventListFormSection';

import AmountInputSet from '../../../../utilities/AmountInputSet'
import FormSection from '../../../../utilities/FormSection';
import SingleLineFormGroup from '../../formgroups/SingleLineFormGroup'

import { StepSelectOptions } from '../../../../../contexts/StepSelectOptions'

const RemoveFromReactionForm = ({ workup, onWorkupChange }) => {
	const stepSelectOptions = useContext(StepSelectOptions);
	const removableSamplesOptions = stepSelectOptions.FORMS.EVAPORATION.removable_samples[workup.origin_type]

	const handleWorkupChange = (name) => (value) => {
		onWorkupChange({ name: name, value: value });
	}

	return (
		<>
			<FormSection>
				<SingleLineFormGroup label={'Samples'}>
					<Select
						isMulti
						isClearable={false}
						className="react-select--overwrite"
						classNamePrefix="react-select"
						name="samples"
						options={removableSamplesOptions}
						value={workup.samples}
						onChange={handleWorkupChange('samples')}
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
	);
};

export default RemoveFromReactionForm
