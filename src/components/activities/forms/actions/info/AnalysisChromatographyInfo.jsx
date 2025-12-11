import React from 'react'

import InfoLinesBox from './InfoLinesBox';

const AnalysisChromatographyInfo = ({ activity }) => {

	let infoTitle = ""
	let infoLines = []
	let workup = activity.workup
	let steps = workup["purification_steps"] || [];

	const addStepsToTitle = () => {
		if (steps) {
			infoTitle += steps.length + " Step";
			if (steps.length > 1) { infoTitle += "s"; }
		}
	}
	addStepsToTitle()


	return (
		<InfoLinesBox title={infoTitle} lines={infoLines} />
	)
}

export default AnalysisChromatographyInfo
