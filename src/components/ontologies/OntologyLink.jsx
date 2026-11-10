import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";

const OntologyLink = ({ ontology, size="lg" }) => {
	return (
			<a href={ontology.link} target="_blank" rel="noreferrer" title={ontology.link || 'No link available'}>
				<FontAwesomeIcon
					icon={faExternalLink}
					size={size}
				/>
			</a>
	)
}

export default OntologyLink
