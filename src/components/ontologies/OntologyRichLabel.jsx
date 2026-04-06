import React, { useContext } from 'react'

import { SelectOptions } from "../../contexts/SelectOptions";

import OntologiesOptionsDecorator from '../../decorators/OntologiesOptionsDecorator';

const OntologyRichLabel = ({ ontology, ontologyId }) => {

	const ontologies = useContext(SelectOptions).ontologies

	ontology ||= OntologiesOptionsDecorator.findByOntologyId({ ontologyId: ontologyId, ontologies: ontologies })

	return (
		<>
			{'[' + ontology?.ontology_id + '] ' }
			<b>
				{(ontology?.label || ontology?.name || 'No label')}
			</b>
		</>
	)
}

export default OntologyRichLabel
