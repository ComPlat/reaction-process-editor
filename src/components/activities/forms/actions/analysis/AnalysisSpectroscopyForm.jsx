import React, { useContext } from 'react'

import FormSection from '../../../../utilities/FormSection'
import SampleOrMolecularEntityFormGroups from './SampleOrMolecularEntityFormGroups'

import OntologySelectFormGroup from '../../formgroups/OntologySelectFormGroup'
import SolventListFormGroup from '../../formgroups/SolventListFormGroup'

import OptionsDecorator from '../../../../../decorators/OptionsDecorator'
import OntologiesOptionsDecorator from '../../../../../decorators/OntologiesOptionsDecorator'

import { SelectOptions } from '../../../../../contexts/SelectOptions';

const AnalysisSpectroscopyForm = ({ workup, onWorkupChange }) => {
	const selectOptions = useContext(SelectOptions)
	const molecularEntitiesOptions = useContext(SelectOptions).materials['MOLECULAR_ENTITY']

	const filteredOntologiesByRoleName = (roleName) =>
		OntologiesOptionsDecorator.activeOptionsForWorkupDependencies({ roleName: roleName, ontologies: selectOptions.ontologies, workup: workup })

	const handleWorkupChange = (workupKey) => (value) => onWorkupChange({ name: workupKey, value: value })

	const handleChangeType = (newType) => {
		onWorkupChange({ name: 'type', value: newType?.value })
		handleChangeSubType(OptionsDecorator.optionForValue(workup.subtype, filteredOntologiesByRoleName('subtype')))
	}

	const handleChangeSubType = (newSubType) => {
		onWorkupChange({ name: 'subtype', value: newSubType?.value })
	}

	const solventOptions = OptionsDecorator.optionForValue(workup.device, selectOptions.ontologies)?.mobile_phase || []

	return (
		<FormSection>
			<SampleOrMolecularEntityFormGroups
				samples={workup.samples}
				sampleOptions={selectOptions.materials['SAMPLE']}
				onSamplesChange={handleWorkupChange('samples')}
				molecularEntities={workup.molecular_entities}
				molecularEntityOptions={molecularEntitiesOptions}
				onMolecularEntitiesChange={handleWorkupChange('molecular_entities')}
			/>
			<OntologySelectFormGroup
				key={"type" + workup.type}
				roleName={'type'}
				workup={workup}
				onChange={handleChangeType}
			/>
			<OntologySelectFormGroup
				key={"subtype" + workup.subtype}
				roleName={'subtype'}
				workup={workup}
				onChange={handleChangeSubType}
			/>
			<OntologySelectFormGroup
				key={"device" + workup.device}
				roleName={'device'}
				workup={workup}
				onChange={selected => onWorkupChange({ name: 'device', value: selected?.value })}
			/>
			<SolventListFormGroup
				solvents={workup.solvents}
				solventOptions={solventOptions}
				setSolvents={selected => onWorkupChange({ name: 'solvents', value: selected })}
			/>
		</FormSection>
	)
}

export default AnalysisSpectroscopyForm
