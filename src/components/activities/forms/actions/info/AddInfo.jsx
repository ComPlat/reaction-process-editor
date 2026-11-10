import React from 'react'

import InfoLinesBox from './InfoLinesBox';

import ActivityInfoDecorator from '../../../../../decorators/ActivityInfoDecorator';
import MetricsDecorator from '../../../../../decorators/MetricsDecorator';
import SamplesDecorator from '../../../../../decorators/SamplesDecorator';
import StringDecorator from '../../../../../decorators/StringDecorator';

const AddInfo = ({ activity }) => {
	let workup = activity.workup
	let infoTitle = MetricsDecorator.infoLineAmount(workup.target_amount);

	let infoLines = []
	infoLines.push(StringDecorator.toLabelSpelling(workup.acts_as));
	workup.acts_as === "DIVERSE_SOLVENT" && infoLines.push(workup.is_waterfree_solvent ? "waterfree" : "not waterfree");
	infoLines.push(ActivityInfoDecorator.infoLineSampleCondition(workup));

	const renderSampleSvg = () => workup.acts_as === "SAMPLE" ? SamplesDecorator.sampleSvgImg(activity.sample) : <></>

	return (
		<div className="activity-info__add">
			{renderSampleSvg()}
			<InfoLinesBox title={infoTitle} lines={infoLines} />
		</div>
	)
}

export default AddInfo
