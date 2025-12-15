import React, { useContext } from 'react'
import { Label, FormGroup } from 'reactstrap'

import FormSection from '../../../../utilities/FormSection'
import SamplesIconSelect from '../../../../utilities/SamplesIconSelect'

import OntologySelectFormGroup from '../../formgroups/OntologySelectFormGroup'
import SolventListFormGroup from '../../formgroups/SolventListFormGroup'

import OptionsDecorator from '../../../../../decorators/OptionsDecorator'
import OntologiesDecorator from '../../../../../decorators/OntologiesDecorator'

import { SelectOptions } from '../../../../../contexts/SelectOptions';

const AnalysisSpectroscopyForm = ({ workup, onWorkupChange }) => {
	const selectOptions = useContext(SelectOptions)
	const molecularEntitiesOptions = useContext(SelectOptions).materials['MOLECULAR_ENTITY']

	const filteredOntologiesByRoleName = (roleName) =>
		OntologiesDecorator.activeOptionsForWorkupDependencies({ roleName: roleName, options: selectOptions.ontologies, workup: workup })

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
			<FormGroup>
				<Label>Sample</Label>
				<SamplesIconSelect
					isMulti
					isClearable={false}
					samples={workup.samples}
					options={selectOptions.materials['SAMPLE']}
					onChange={handleWorkupChange('samples')}
				/>
			</FormGroup>
			<FormGroup>
				<Label>Molecular Entity</Label>
				<SamplesIconSelect
					isMulti
					isClearable={false}
					options={molecularEntitiesOptions}
					samples={workup.molecular_entitites}
					onChange={handleWorkupChange('molecular_entities')}
				/>
			</FormGroup>
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
