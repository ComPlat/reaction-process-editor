import React, { useContext } from 'react'
import { Label, FormGroup } from 'reactstrap'

import FormSection from '../../../../utilities/FormSection'
import SamplesIconSelect from '../../../../utilities/SamplesIconSelect'

import OntologyMultiSelectFormGroup from '../../formgroups/OntologyMultiSelectFormGroup'
import OntologySelectFormGroup from '../../formgroups/OntologySelectFormGroup'

import { SelectOptions } from '../../../../../contexts/SelectOptions';

const AnalysisElementalForm = ({ workup, onWorkupChange }) => {
	const selectOptions = useContext(SelectOptions)
	const molecularEntitiesOptions = useContext(SelectOptions).materials['MOLECULAR_ENTITY']

	const handleWorkupChange = (workupKey) => (value) => onWorkupChange({ name: workupKey, value: value })

	const handleChangeDetectors = (detectors) => {
		onWorkupChange({ name: 'detector', value: detectors?.map(detector => detector.value) })
	}

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
				key={"device" + workup.device}
				roleName={'device'}
				workup={workup}
				onChange={selected => onWorkupChange({ name: 'device', value: selected?.value })}
			/>
			<OntologyMultiSelectFormGroup
				key={"detector" + workup.detector}
				label={'Detectors'}
				roleName={'detector'}
				workup={workup}
				onChange={handleChangeDetectors}
			/>
		</FormSection>
	)
}

export default AnalysisElementalForm
