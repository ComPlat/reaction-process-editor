import React from 'react'

import { UncontrolledTooltip } from "reactstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";

import { uniqueId } from 'react-bootstrap-typeahead/types/utils';

const OntologyLink = ({ ontology, size="lg" }) => {

	let tooltipId = uniqueId('ontology-link-')
	return (
		<>
			<a href={ontology.link} target="_blank" rel="noreferrer">
				<FontAwesomeIcon
					id={tooltipId}
					icon={faExternalLink}
					size={size}
				/>
			</a>
			<UncontrolledTooltip
				target={tooltipId}>
				{ontology.link}
			</UncontrolledTooltip >
		</>
	)
}

export default OntologyLink
