import React, { useContext } from 'react'
import { Label, FormGroup } from 'reactstrap'

import FormSection from '../../../../utilities/FormSection'
import SamplesIconSelect from '../../../../utilities/SamplesIconSelect'

import ButtonGroupToggle from '../../formgroups/ButtonGroupToggle'
import OntologySelectFormGroup from '../../formgroups/OntologySelectFormGroup'
import SolventListFormGroup from '../../formgroups/SolventListFormGroup'

import OptionsDecorator from '../../../../../decorators/OptionsDecorator'
import OntologiesDecorator from '../../../../../decorators/OntologiesDecorator'

import { SelectOptions } from '../../../../../contexts/SelectOptions';

import { ontologyId } from '../../../../../constants/ontologyId'

const AnalysisSpectroscopyForm = ({ workup, onWorkupChange }) => {
	const selectOptions = useContext(SelectOptions)
	const molecularEntitiesOptions = useContext(SelectOptions).materials['MOLECULAR_ENTITY']

	const filteredOntologiesByRoleName = (roleName) =>
		OntologiesDecorator.activeOptionsForWorkupDependencies({ roleName: roleName, options: selectOptions.ontologies, workup: workup })

	const handleWorkupChange = (workupKey) => (value) => onWorkupChange({ name: workupKey, value: value })

	const handleChangeAutomation = (automation) => {
		if (automation !== ontologyId.automation_modes.automated) {
			onWorkupChange({ name: 'method', value: undefined })
		}
		onWorkupChange({ name: 'automation_mode', value: automation })
	}

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
			<ButtonGroupToggle
				value={workup.automation_mode}
				options={filteredOntologiesByRoleName('automation_mode')}
				onChange={handleChangeAutomation} />

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
