import React, { useContext } from 'react'

import InfoLinesBox from './InfoLinesBox';

import ActivityInfoDecorator from '../../../../../decorators/ActivityInfoDecorator';
import OptionsDecorator from '../../../../../decorators/OptionsDecorator';

import { conditionFormMetricNames } from '../../../../../constants/formMetrics';

import { SelectOptions } from "../../../../../contexts/SelectOptions";

const ConditionInfo = ({ activity, preconditions }) => {
	const selectOptions = useContext(SelectOptions);

	let workup = activity.workup
	let infoTitle = ''
	let infoLines = []

	let device = OptionsDecorator.inclusiveOptionForValue(workup.device, selectOptions.ontologies)
	infoLines.push(device?.label + ' / ' + workup.method)

	for (let [metricName, conditionWorkup] of Object.entries(workup)) {
		if (conditionFormMetricNames.includes(metricName)) {
			// The EQUIPMENT will be appended globally for all Activity types; we avoid duplicating it.
			metricName !== "EQUIPMENT" &&
				infoLines.push(
					ActivityInfoDecorator.conditionInfo(
						metricName,
						conditionWorkup,
						preconditions[metricName],
						selectOptions
					)
				);
		}
	}

	return (
		<InfoLinesBox title={infoTitle} lines={infoLines} />
	)
}

export default ConditionInfo
