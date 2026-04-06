import React from 'react'

import { Button } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import OntologyRichLabel from './OntologyRichLabel';

const DeletableItem = ({ ontologyId, onDelete }) => {
	return (
		<div size="sm">
			<Button color="danger" onClick={onDelete} size="sm" className="mt-1 mx-2">
				<FontAwesomeIcon icon="trash" size="sm" />
			</Button>
			<OntologyRichLabel ontologyId={ontologyId}/>
		</div>
	)
}

export default DeletableItem
