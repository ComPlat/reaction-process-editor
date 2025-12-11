import React, { useContext } from 'react'

import InfoLinesBox from './InfoLinesBox';

import OntologiesDecorator from '../../../../../decorators/OntologiesDecorator';
import PurificationDecorator from '../../../../../decorators/PurificationDecorator';
import { SelectOptions } from '../../../../../contexts/SelectOptions';

const AnalysisSpectroscopyInfo = () => {

	let infoTitle = ""
	let infoLines = []

	return (
		<InfoLinesBox title={infoTitle} lines={infoLines} />
	)
}

export default AnalysisSpectroscopyInfo
