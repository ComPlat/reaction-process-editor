import React, { useContext } from 'react'
import { FormGroup, Label } from 'reactstrap';

import ButtonGroupToggle from '../formgroups/ButtonGroupToggle';
import OntologySelectFormGroup from '../formgroups/OntologySelectFormGroup';

import OntologiesDecorator from '../../../../decorators/OntologiesDecorator';
import OptionsDecorator from '../../../../decorators/OptionsDecorator';

import { SelectOptions } from '../../../../contexts/SelectOptions';

const DeviceMethodFormSet = ({
	activity,
	onWorkupChange,
}) => {
	let ontologies = useContext(SelectOptions).ontologies
	let workup = activity.workup

	const ontologiesByRoleName = (roleName) => OntologiesDecorator.activeOptionsForRoleName({ roleName: roleName, options: ontologies })

	const handleChangeAutomation = (newAutomationMode) => {
		onWorkupChange({ name: 'automation_mode', value: newAutomationMode })
	}

	const handleChangeType = (newType) => {
		if (newType?.value !== workup.type) {
			onWorkupChange({ name: 'type', value: newType?.value })
			handleChangeSubType({ value: undefined })
		}
	}

	const handleChangeSubType = (newSubType) => {
		if (newSubType?.value !== workup.subtype) {
			onWorkupChange({ name: 'subtype', value: newSubType?.value })
			handleChangeDevice({ value: undefined })
		}
	}

	const handleChangeDevice = (device) => {
		onWorkupChange({ name: 'device', value: device?.value })
		if (device?.value !== workup.device) { handleChangeMethod(undefined) }
	}

	const handleChangeMethod = (method) => {
		onWorkupChange({ name: 'method', value: method?.value })
	}
	const currentDeviceOption = OptionsDecorator.inclusiveOptionForValue(workup.device, ontologies)

	const requiresTypeSubtypeForm = ['ADD', 'TRANSFER', 'MIXING'].includes(activity.activity_name)

	return (
		<>
			<FormGroup className='row gx-2 pt-1'>
				<Label>Mode</Label>
				<ButtonGroupToggle
					value={workup.automation_mode}
					options={ontologiesByRoleName('automation_mode')}
					onChange={handleChangeAutomation} />
			</FormGroup>

			{requiresTypeSubtypeForm && <>
				<OntologySelectFormGroup
					key={"type" + workup.type}
					roleName={'type'}
					workup={workup}
					onChange={handleChangeType}
				// options={typesMatchingDetectors}
				/>
				<OntologySelectFormGroup
					key={"subtype" + workup.subtype + "type" + workup.type}
					roleName={'subtype'}
					workup={workup}
					onChange={handleChangeSubType}
				/>
			</>
			}

			<OntologySelectFormGroup
				key={"device" + workup.device}
				roleName={'device'}
				workup={workup}
				onChange={handleChangeDevice}
			/>
			<OntologySelectFormGroup
				key={"method" + workup.method}
				roleName={'method'}
				workup={workup}
				options={currentDeviceOption?.methods}
				onChange={handleChangeMethod}
			/>
		</>
	);
};

export default DeviceMethodFormSet
