import React, { useContext } from 'react'

import FormSection from '../../../../utilities/FormSection'
import SampleOrMolecularEntityFormGroups from './SampleOrMolecularEntityFormGroups'

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
			<SampleOrMolecularEntityFormGroups
				samples={workup.samples}
				sampleOptions={selectOptions.materials['SAMPLE']}
				onSamplesChange={handleWorkupChange('samples')}
				molecularEntities={workup.molecular_entities}
				molecularEntityOptions={molecularEntitiesOptions}
				onMolecularEntitiesChange={handleWorkupChange('molecular_entities')}
			/>
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
