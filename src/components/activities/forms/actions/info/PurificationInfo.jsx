import React, { useContext } from 'react'

import InfoLinesBox from './InfoLinesBox';

import OptionsDecorator from '../../../../../decorators/OptionsDecorator'
import PurificationDecorator from '../../../../../decorators/PurificationDecorator'

import { SelectOptions } from "../../../../../contexts/SelectOptions";
import OntologiesDecorator from '../../../../../decorators/OntologiesDecorator';

const PurificationInfo = ({ activity }) => {

	let infoTitle = ""
	let infoLines = []
	let workup = activity.workup
	let steps = workup["purification_steps"];

	const purificationOptions = useContext(SelectOptions).FORMS.PURIFICATION[workup.purification_type];
	const ontologies = useContext(SelectOptions).ontologies;

	const addOntologyAutomationToTitle = () => {
		infoTitle += " "
		infoTitle += OntologiesDecorator.labelForOntologyId({ ontologyId: workup.automation_mode, ontologies: ontologies })
	}

	const addAutomationToTitle = () => {
		infoTitle += " "
		infoTitle += OptionsDecorator.valueToLabel(workup.automation_mode, purificationOptions.automation_modes)
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

	switch (workup.purification_type) {
		case "CENTRIFUGATION":
			break;
		case "CRYSTALLIZATION":
			addAutomationToTitle()
			addPurificationSolventsToLines()
			break;
		case "CHROMATOGRAPHY":
			addStepsToTitle()
			addOntologyAutomationToTitle()
			addPurificationSolventsToLines()
			break;
		case "EXTRACTION":
			addStepsToTitle()
			infoTitle += " " + workup.automation_mode?.toLowerCase() + ", Phase: " + workup.phase?.toLowerCase();
			addPurificationSolventsToLines()
			break;
		case "FILTRATION":
			addStepsToTitle()
			addAutomationToTitle()
			infoTitle += " Keep " + OptionsDecorator.valueToLabel(workup.filtration_mode, purificationOptions.modes
			);
			addPurificationSolventsToLines()
			break;
		default:
			infoTitle = "Error in PurificationInfo: Unknown type: " + workup.purification_type
			break;
	}

	return (
		<InfoLinesBox title={infoTitle} lines={infoLines} />
	)
}

export default PurificationInfo
