import React, { useContext } from 'react'

import { Button } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import OntologiesOptionsDecorator from '../../decorators/OntologiesOptionsDecorator';
import { SelectOptions } from '../../contexts/SelectOptions';

const OntologyDeletableItem = ({ ontologyId, onDelete }) => {
	let ontologyOptions = useContext(SelectOptions)

	let ontology = OntologiesOptionsDecorator.findByOntologyId({ ontologyId: ontologyId, ontologies: ontologyOptions })

	return (
		<div>
			<Button color="danger" onClick={onDelete} size="sm" className="mt-1 mx-3">
				<FontAwesomeIcon icon="trash" size="sm" />
			</Button>
			{ontology?.ontology_id + ' ' + (ontology?.label || ontology?.name)}
		</div>
	)

}

export default OntologyDeletableItem
