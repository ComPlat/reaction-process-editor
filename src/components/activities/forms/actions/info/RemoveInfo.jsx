import React, { useContext } from 'react'

import InfoLinesBox from './InfoLinesBox';

import ActivityInfoDecorator from '../../../../../decorators/ActivityInfoDecorator';
import OptionsDecorator from '../../../../../decorators/OptionsDecorator';

import { removeFormMetricNames } from '../../../../../constants/formMetrics';
import { SelectOptions } from "../../../../../contexts/SelectOptions";

const RemoveInfo = ({ activity }) => {

	const selectOptions = useContext(SelectOptions)
	let workup = activity.workup

	let infoTitle = workup['samples']?.map((sample) => sample?.label).join(', ')

	let infoLines = []

	let solventsLine = workup['solvents']?.map((solvent) => solvent.label).join(', ')
	if (solventsLine) { infoLines.push("Solvents: " + solventsLine) }

	if (workup['remove_steps']) {
		infoLines.push(' ' + workup['remove_steps'].length + ' Steps ' + OptionsDecorator.valueToLabel(workup.automation_mode, selectOptions.automation_modes))
	} else {
		infoLines.push(OptionsDecorator.valueToLabel(workup.automation_mode, selectOptions.automation_modes))
	}

	for (let [key, removeWorkup] of Object.entries(workup)) {
		if (removeFormMetricNames.includes(key)) {
			infoLines.push(ActivityInfoDecorator.conditionInfo(removeWorkup, selectOptions));
		}
	}

	return (
		<InfoLinesBox title={infoTitle} lines={infoLines} />
	)
}

export default RemoveInfo
