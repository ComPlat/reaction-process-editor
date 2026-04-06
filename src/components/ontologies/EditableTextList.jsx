import React, { useState } from 'react'

import { Input, Button, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditableTextList = ({ label, items, onChange }) => {

	const [inputText, setInputText] = useState('')

	const deleteItem = (itemId) => () => {
		let newItems = JSON.parse(JSON.stringify(items))
		let index = newItems.indexOf(itemId);
		if (index > -1) { newItems = newItems.toSpliced(index, 1); }
		onChange(newItems)
	}

	const addItem = () => {
		if (!!inputText) {
			let newItems = JSON.parse(JSON.stringify(items)) || []
			onChange(newItems.concat([inputText]))
		}
	}

	const handleKeyInput = (event) => {
		if (event.key === "Enter" && !!inputText) {
			addItem()
			setInputText('')
		}
	}

	return (
		<>
			<div className="row">
				<div className="col-9">
					<Input
						className="m-3"
						value={inputText}
						placeholder={'Add ' + label}
						onChange={(event) => setInputText(event.target.value)}
						onKeyUp={handleKeyInput}
					/>
				</div>
				<Button color="success" className="col-2 m-3" onClick={addItem} disabled={inputText?.length === 0}>+ Add</Button>
			</div>
			<Label>{label}</Label>
			{items?.map(item => <div>
				<Button color="danger" onClick={deleteItem(item)} size="sm" className="mt-1 mx-3">
					<FontAwesomeIcon icon="trash" size="sm" />
				</Button>
				{item}</div>)}

		</>)
}

export default EditableTextList
