import React from 'react'

import InfoLinesBox from './InfoLinesBox';

import MetricsDecorator from '../../../../../decorators/MetricsDecorator';
import StringDecorator from '../../../../../decorators/StringDecorator';

const TransferInfo = ({ activity }) => {
	let workup = activity.workup
	let sample = activity.sample

	let infoTitle = ''

	if (sample) {
		infoTitle += StringDecorator.toLabelSpelling(sample.intermediate_type || 'Initial')
		infoTitle += ' ' + sample.short_label

		if (sample.short_label !== sample.name) { infoTitle += ' ' + sample.name }
	}

	let infoLines = []

	infoLines.push(MetricsDecorator.infoLineAmountWithPercentage(workup.target_amount));
	infoLines.push((activity.transfer_source_step_name || 'Initial') +
		" -> " + (activity.transfer_target_step_name || 'Unnamed Step'));

	return (
		<InfoLinesBox title={infoTitle} lines={infoLines} />
	)
}

export default TransferInfo
