import React, { useContext } from 'react'

import OptionsDecorator from '../../../../decorators/OptionsDecorator';
import SolventListFormGroup from '../formgroups/SolventListFormGroup';

import { SelectOptions } from '../../../../contexts/SelectOptions';

const GasExchangeForm = ({ workup, onWorkupChange }) => {

	let ontologies = useContext(SelectOptions).ontologies

	const solventOptions = OptionsDecorator.optionForValue(workup.device, ontologies)?.mobile_phase || []

	return (
		<SolventListFormGroup
			label={"Gas"}
			solvents={workup.gas_type}
			solventOptions={solventOptions}
			setSolvents={selected => onWorkupChange({ name: 'gas_type', value: selected })}
		/>
	)
}

export default GasExchangeForm
