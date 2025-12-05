import React, { useContext } from 'react'

import InfoLinesBox from './InfoLinesBox';

import OntologiesDecorator from '../../../../../decorators/OntologiesDecorator';
import PurificationDecorator from '../../../../../decorators/PurificationDecorator';
import { SelectOptions } from '../../../../../contexts/SelectOptions';

const AnalysisInfo = ({ activity }) => {

	let infoTitle = ""
	let infoLines = []
	let workup = activity.workup
	let steps = workup["purification_steps"] || [];

	const purificationOptions = useContext(SelectOptions).FORMS.ANALYSIS[workup.analysis_type] || {};
	const ontologies = useContext(SelectOptions).ontologies;

	const addOntologyAutomationToTitle = () => {
		infoTitle += " "
		infoTitle += OntologiesDecorator.labelForONTOLOGIES({ ONTOLOGIES: workup.automation_mode, ontologies: ontologies })
	}

	const addStepsToTitle = () => {
		if (steps) {
			infoTitle += steps.length + " Step";
			if (steps.length > 1) { infoTitle += "s"; }
		}
	}

	const addPurificationSolventsToLines = () => {
		infoLines = infoLines.concat(PurificationDecorator.infoLinePurificationSolvents(workup, purificationOptions.solvents))
	}

	switch (workup.analysis_type) {
		case "CHROMATOGRAPHY":
			addStepsToTitle()
			addOntologyAutomationToTitle()
			addPurificationSolventsToLines()
			break;
		case "SPECTROSCOPY":
			break;
		default:
			infoTitle = "Error in PurificationInfo: Unknown type " + workup.analysis_type + "."
			break;
	}

	return (
		<InfoLinesBox title={infoTitle} lines={infoLines} />
	)
}

export default AnalysisInfo
