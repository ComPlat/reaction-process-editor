import React from 'react'

import { UncontrolledTooltip } from "reactstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";

import uniqueId from '../utilities/uniqueId';

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
				{ontology.link || 'No link available'}
			</UncontrolledTooltip >
		</>
	)
}

export default OntologyLink
