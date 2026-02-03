import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Row, Col, Button } from 'reactstrap'

import FormButtons from './FormButtons'
import NumericalInput from './NumericalInput'
import ChromatographyFractionForm from './ChromatographyFractionForm'
import VialButton from './VialButton'

import { useReactionsFetcher } from '../../fetchers/ReactionsFetcher';

const ChromatographyPoolingForm = ({ activity, onCancel, onSave }) => {
	const api = useReactionsFetcher()

	const [currentTrayNo, setcurrentTrayNo] = useState(1)

	const hasAutomationResponse = !!activity.automation_response

	const vialPlates = activity.automation_response?.vialPlates
	const trayCount = vialPlates?.length || 0

	let allVials = []
	vialPlates?.forEach(tray => allVials.push(...tray.vials))
	allVials = allVials.map(v => v?.toString())

	const currentPlate = vialPlates?.[currentTrayNo - 1] || []
	const trayType = currentPlate?.['trayType'] || "No trayType defined, automation response defect?"

	const trayColumns = currentPlate?.['trayColumns'] || 1
	const vialsPerTray = currentPlate?.['vials']?.length || 1

	const initialFraction = { position: 1, vials: allVials.filter(v => v), consuming_activity_name: 'DEFINE_FRACTION' }
	const [fractions, setFractions] = useState(activity.fractions?.length > 0 ? activity.fractions : [initialFraction])

	const [renderCountToForciblyUpdateVialsStateInFunctionClaimVial, setRenderCount] = useState(0);

	const updateFractions = (newFractions) => {
		newFractions = newFractions.map((fraction, idx) => {
			fraction.position = idx + 1
			fraction.vials = allVials.filter(aVial => aVial && fraction.vials.includes(aVial)) // reorder vials like allVials
			return fraction
		})
		setFractions(newFractions)
		setRenderCount(renderCountToForciblyUpdateVialsStateInFunctionClaimVial + 1)
	}

	const addFraction = () => {
		let newFractions = [...fractions]
		newFractions.push({ consuming_activity_name: 'DEFINE_FRACTION', vials: [] })
		updateFractions(newFractions)
	}

	const deleteFraction = (position) => () => {
		let newFractions = [...fractions]

		let sourceTargetIndex = position - 1

		let moveVialTargetIndex = sourceTargetIndex === 0 ? 1 : 0

		newFractions[moveVialTargetIndex].vials = newFractions[moveVialTargetIndex].vials.concat(newFractions[sourceTargetIndex].vials)

		newFractions = newFractions.toSpliced(sourceTargetIndex, 1)
		updateFractions(newFractions)
	}

	const fractionNoForVial = (vial) => {
		return fractions.find(fraction => fraction.vials.includes(vial))?.position
	}

	const handleSave = () => {
		api.createFractionActivities(activity, fractions)
		onSave(fractions)
		setRenderCount(renderCountToForciblyUpdateVialsStateInFunctionClaimVial + 1)
	}

	const removeVialFromFraction = (fraction) => (removeVial) => {
		return { ...fraction, vials: fraction.vials.filter(vial => vial !== removeVial) }
	}

	const moveVialToFraction = (newPosition) => (moveVial) => {
		let newIdx = newPosition - 1
		let newFractions = [...fractions]

		newFractions = newFractions.map(newFraction => removeVialFromFraction(newFraction)(moveVial))
		newFractions[newIdx].vials = newFractions[newIdx].vials.concat(moveVial)

		updateFractions(newFractions)
	}

	const moveVialToNextFraction = (moveVial) => () => {
		let sourceFraction = fractions.find(fraction => fraction.vials.includes(moveVial))
		let newPosition = sourceFraction.position + 1

		newPosition = (newPosition > fractions.length) ? 1 : newPosition

		moveVialToFraction(newPosition)(moveVial)
	}

	const handleFractionChange = (position) => (newFraction) => {
		let newFractions = [...fractions]
		newFractions[position - 1] = newFraction
		updateFractions(newFractions)
	}


	const renderFractionForm = (fraction) => {
		return (
			<ChromatographyFractionForm
				key={"fraction-form-" + fraction.position + "-" + renderCountToForciblyUpdateVialsStateInFunctionClaimVial}
				fraction={fraction}
				claimVial={moveVialToFraction(fraction.position)}
				onChange={handleFractionChange(fraction.position)}
				onDelete={deleteFraction(fraction.position)}
				canDelete={fractions.length > 1}
			/>
		)
	}

	const renderFractionsForms = () => {
		return (fractions.map((fraction) => (
			renderFractionForm(fraction)
		)))
	}

	const renderBreak = (idx) => {
		if (idx % trayColumns === trayColumns - 1) { return (<br />) }
	}

	const renderCurrentVialPlate = (trayNo) => {
		const firstVial = 0 + (trayNo - 1) * vialsPerTray
		const lastVial = firstVial + vialsPerTray


		return allVials.slice(firstVial, lastVial).map((vial, idx) => {
			return (
				<>
					<VialButton
						key={"vial-button-" + idx}
						vial={vial}
						colorGroup={fractionNoForVial(vial)}
						onClick={moveVialToNextFraction(vial)}
					/>
					{renderBreak(idx)}
				</>
			)
		})
	}

	const renderVialOverview = () => {
		return (
			<>
				<Row className='gx-2 mb-5'>
					<Col md={2} className={'p-3'}>
						<div className={'p-3'}>
							{trayType}
						</div>
						<div className={'p-3'}>
							{"Tray No. " + currentTrayNo + "/" + trayCount}
						</div>
						<NumericalInput
							value={currentTrayNo}
							step={1}
							min={1}
							max={trayCount}
							size={8}
							onChange={setcurrentTrayNo}
							className='form-control'
						/>
					</Col>

					<Col md={1}>
					</Col>
					<Col md={7}>
						<DndProvider backend={HTML5Backend}>
							{renderCurrentVialPlate(currentTrayNo)}
						</DndProvider>
					</Col>
					<Col md={1}>
						<FormButtons
							onSave={handleSave}
							onCancel={onCancel}
						/>
					</Col>
				</Row >
				<Row>
					<Col md={1}>
					</Col>
					<Col md={10}>
						<Button
							onClick={addFraction}
						>+ Add Fraction</Button>
					</Col>
				</Row>
			</>
		)
	}

	const renderNoAutomationResponseHint = () => {
		return (
			<>
				The action has not yet received an automation response that needs to be resolved.
			</>
		)
	}

	const renderIncompleteFractions = () => {
		return (
			<>
				Not all vials have been assigned to a fraction.
			</>
		)
	}

	return (
		<>
			{hasAutomationResponse && renderVialOverview()}
			{hasAutomationResponse && renderFractionsForms()}
			{!hasAutomationResponse && renderNoAutomationResponseHint()}
			{activity.incomplete_fractions && renderIncompleteFractions()}
			<FormButtons
				disableSave={!hasAutomationResponse || !activity.id}
				onSave={handleSave}
				onCancel={onCancel}
			/>
		</>
	)
}


export default ChromatographyPoolingForm
