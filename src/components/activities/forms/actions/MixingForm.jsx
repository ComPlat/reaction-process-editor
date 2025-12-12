import React from 'react'
import AmountInputSet from '../../../utilities/AmountInputSet'
import MetricsInputFormGroup from '../formgroups/MetricsInputFormGroup'
import MetricsDecorator from '../../../../decorators/MetricsDecorator'

const MixingForm = ({ workup, onWorkupChange }) => {

	const handleWorkupChange = (name) => (value) => {
		onWorkupChange({ name: name, value: value });
	}

	return (
		<>
			<MetricsInputFormGroup
				key={'SPEED'}
				metricName={'SPEED'}
				amount={workup.speed}
				onChange={handleWorkupChange('speed')}
			/>
		</>
	)
}

export default MixingForm
