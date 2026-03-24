import React from 'react'

import { Label } from 'reactstrap';

import Select from 'react-select';

import OntologyDeletableItem from './OntologyDeletableItem';

const OntologyEditableItemList = ({ label, items, onChange, filteredOntologies }) => {


	const deleteItem = (itemId) => () => {
		let newItems = JSON.parse(JSON.stringify(items))
		let index = newItems.indexOf(itemId);
		if (index > -1) { newItems = newItems.toSpliced(index, 1); }
		onChange(newItems)
	}

	const addItem = (itemId) => {
		console.log("addItem")
		let newItems = JSON.parse(JSON.stringify(items)) || []
		onChange(newItems.concat([itemId]))
	}

	return (
		<>
			<Label>{label}</Label>
			{
				items?.map(itemId =>
					<OntologyDeletableItem ontologyId={itemId} onDelete={deleteItem(itemId)} />)
			}
			<Select
				type="select"
				placeholder={'Add ' + label}
				className="mt-3 form-select-border-success"
				options={filteredOntologies}
				onChange={selectedOption => addItem(selectedOption.value)}
			/>
		</>)

}

export default OntologyEditableItemList
