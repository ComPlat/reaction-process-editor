import React, { useContext } from 'react'

import InfoLinesBox from './InfoLinesBox';

import OptionsDecorator from '../../../../../decorators/OptionsDecorator'
import PurificationDecorator from '../../../../../decorators/PurificationDecorator'

import { SelectOptions } from "../../../../../contexts/SelectOptions";

import ActivityInfoDecorator from '../../../../../decorators/ActivityInfoDecorator';
// import OntologiesDecorator from '../../../../../decorators/OntologiesDecorator';

const PurificationInfo = ({ activity, preconditions }) => {

	let infoTitle = ""
	let infoLines = []
	let workup = activity.workup
	let steps = workup["purification_steps"];

	const purificationOptions = useContext(SelectOptions).FORMS[activity.activity_name];
	// const selectOptions = useContext(SelectOptions);

	// const addOntologyAutomationToTitle = () => {
	// 	infoTitle += " "
	// 	infoTitle += OntologiesDecorator.labelForOntologyId({ ontologyId: workup.automation_mode, ontologies: selectOptions.ontologies })
	// }

	// const addAutomationToTitle = () => {
	// 	infoTitle += " "
	// 	infoTitle += OptionsDecorator.valueToLabel(workup.automation_mode, purificationOptions.automation_modes)
	// }

	const addStepsToTitle = () => {
		if (steps) {
			infoTitle += steps.length + " Step";
			if (steps.length > 1) { infoTitle += "s"; }
		}
	}

	const addPurificationSolventsToLines = () => {
		infoLines = infoLines.concat(PurificationDecorator.infoLinePurificationSolvents(activity, purificationOptions.solvents))
	}

	const addConditionsToLines = () => infoLines.push(ActivityInfoDecorator.infoLineSampleCondition(workup))

	switch (activity.activity_name) {
		case "CENTRIFUGATION":
			// addOntologyAutomationToTitle()
			addConditionsToLines()
			break;
		case "CRYSTALLIZATION":
			// addAutomationToTitle()
			addPurificationSolventsToLines()
			break;
		case "CHROMATOGRAPHY":
			addStepsToTitle()
			// addOntologyAutomationToTitle()
			addPurificationSolventsToLines()
			break;
		case "EXTRACTION":
			addStepsToTitle()
			// infoTitle += " " + workup.automation_mode?.toLowerCase() + ", Phase: " + workup.phase?.toLowerCase();
			addPurificationSolventsToLines()
			break;
		case "FILTRATION":
			addStepsToTitle()
			// addAutomationToTitle()
			infoTitle += " Keep " + OptionsDecorator.valueToLabel(workup.filtration_mode, purificationOptions.modes
			);
			addPurificationSolventsToLines()
			break;
		default:
			infoTitle = "Error in PurificationInfo: Unknown type: " + activity.activity_name
			break;
	}

	return (
		<InfoLinesBox title={infoTitle} lines={infoLines} />
	)
}

export default PurificationInfo
