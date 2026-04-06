import React from 'react'

import { Label } from 'reactstrap';

import Select from 'react-select';

import DeletableItem from './DeletableItem';

const EditableItemList = ({ label, items, onChange, options }) => {

	const deleteItem = (itemId) => () => {
		let newItems = JSON.parse(JSON.stringify(items))
		let index = newItems.indexOf(itemId);
		if (index > -1) { newItems = newItems.toSpliced(index, 1); }
		onChange(newItems)
	}

	const addItem = (itemId) => {
		let newItems = JSON.parse(JSON.stringify(items)) || []
		onChange(newItems.concat([itemId]))
	}

	return (
		<>
			<Select
				type="select"
				placeholder={'Add ' + label}
				className="m-3 react-select--overwrite"
				classNamePrefix="react-select"
				options={options}
				value={''}
				onChange={selectedOption => addItem(selectedOption.value)}
			/>
			<Label className="font-weight-bold">{label}s</Label>
			{
				items?.map(itemId =>
					<DeletableItem ontologyId={itemId} onDelete={deleteItem(itemId)} />)
			}
		</>)

}

export default EditableItemList
