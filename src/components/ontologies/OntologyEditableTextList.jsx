import React, { useState } from 'react'

import { Input, Button, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const OntologyEditableTextList = ({ label, items, onChange }) => {

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
			<Label>{label}</Label>
			{items?.map(item => <div>
				<Button color="danger" onClick={deleteItem(item)} size="sm" className="mt-1 mx-3">
					<FontAwesomeIcon icon="trash" size="sm" />
				</Button>
				{item}</div>)}

			<div className="row">
				<div className="col-10">
					<Input
						className="mt-3"
						value={inputText}
						placeholder={'Add ' + label}
						onChange={(event) => setInputText(event.target.value)}
						onKeyUp={handleKeyInput}
					/>
				</div>
				<Button className="col-2 mt-3" onClick={addItem}> + Add </Button>
			</div>
		</>)
}

export default OntologyEditableTextList
