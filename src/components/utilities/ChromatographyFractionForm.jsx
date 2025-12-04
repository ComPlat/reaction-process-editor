import React, { useContext } from 'react'
import Select from 'react-select';
import { useDrop } from 'react-dnd'
import { DndItemTypes } from '../../constants/dndItemTypes';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Label, Row, Col, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VesselableFormSection from '../vesselables/VesselableFormSection'

import VialButton from './VialButton'

import OptionsDecorator from '../../decorators/OptionsDecorator';

import { SelectOptions } from "../../contexts/SelectOptions";


const ChromatographyFractionForm = ({ fraction, onChange, claimVial, onDelete, canDelete }) => {
	const selectOptions = useContext(SelectOptions).FORMS.POOLING_GROUP;

	const [{ isOver, }, dropRef] = useDrop(() => ({
		accept: DndItemTypes.VIALBUTTON,
		drop: (monitor) => dropItem(monitor),
		collect: (monitor) => ({
			isOver: monitor.isOver() && monitor.canDrop(),
			getItem: monitor.getItem(),
		}),
	}), [])

	const dropItem = (monitor) => { claimVial(monitor.vial) }

	const dropClassName = () => { return isOver ? " bg bg-success bg-opacity-25 " : "" }

	const groupClassName = () => { return " bg bg-primary bg-opacity-25 " }

	const renderVialLine = () => {
		let vials = fraction.vials || []
		return (
			vials.map(vial =>
				<VialButton
					key={vial}
					vial={vial}
					onClick={(event => { })}
					colorGroup={fraction.position} />
			))
	}

	const handleChange = (key) => (value) => { onChange({ ...fraction, [key]: value }) }

	const handleFollowUpActionChange = (selection) => { handleChange("consuming_activity_name")(selection.value) }

	const renderDeleteButton = () => {
		return (
			<>
				{canDelete && <Button color="danger" onClick={onDelete} >
					<FontAwesomeIcon icon="trash" />
				</Button>}
			</>
		)
	}


	return (
		<DndProvider backend={HTML5Backend}>
			<div ref={dropRef} className={"border border-top-1 mt-3 " + dropClassName() + groupClassName()}>
				<Row className={"pt-4 ps-4"}>
					<Col md={5}>
						{renderDeleteButton()}
						<Label className="ps-5">
							{'Fraction #' + (fraction.position)}
						</Label>
						<Select
							className="react-select--overwrite"
							classNamePrefix="react-select"
							name="activityType"
							options={selectOptions.consuming_activity_names}
							value={OptionsDecorator.optionForValue(fraction.consuming_activity_name, selectOptions.consuming_activity_names)}
							onChange={handleFollowUpActionChange}
						/>
						<VesselableFormSection
							onChange={handleChange('vessel')}
							reactionProcessVessel={fraction.vessel} />
					</Col>
					<Col md={7}>
						{renderVialLine()}
					</Col>
				</Row>
				<Row className={"pt-4 ps-4"}>

				</Row >
			</div>
		</DndProvider>
	)
}

export default ChromatographyFractionForm
