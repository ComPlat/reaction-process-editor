import React from 'react'

import MetricsDecorator from '../../../../../decorators/MetricsDecorator';
import StringDecorator from '../../../../../decorators/StringDecorator';

import VesselableDecorator from '../../../../../decorators/VesselableDecorator';

import InfoLinesBox from './InfoLinesBox';

const SaveInfo = ({ activity }) => {
	let workup = activity.workup

	let infoTitle = StringDecorator.toLabelSpelling(workup.intermediate_type) + " " + workup.short_label;

	let infoLines = []
	infoLines.push(workup.description);

	if (workup.target_amount) {
		infoLines.push(MetricsDecorator.infoLineAmount(workup.target_amount));
	}
	infoLines.push(VesselableDecorator.vesselableSingleLine(activity.reaction_process_vessel?.vessel));
	infoLines.push(workup.location);

	return (
		<InfoLinesBox title={infoTitle} lines={infoLines} />
	)
}

export default SaveInfo
