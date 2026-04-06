import React, { useContext, useState } from 'react';

import { Button } from 'reactstrap';

import OntologiesInfoDecorator from '../../decorators/OntologiesInfoDecorator';
import { SelectOptions } from "../../contexts/SelectOptions";

import { OntologyConstants } from '../../constants/OntologyConstants';
import StringDecorator from '../../decorators/StringDecorator';
import OntologyFormModal from './OntologyFormModal';
import OntologyRichLabel from './OntologyRichLabel';
import OntologyLink from './OntologyLink';

const OntologyListItem = ({ ontology, isOpen }) => {

  const ontologies = useContext(SelectOptions).ontologies

  const [formOpen, setFormOpen] = useState(isOpen)
  const toggleModal = () => setFormOpen(!formOpen)

  const renderDeviceInfoRow = (ontology) => {
    let detectorsLength = ontology.detectors?.length
    let solventsLength = ontology.solvents?.length
    let phasesLength = ontology.stationary_phase?.length

    return (detectorsLength || solventsLength || phasesLength)
      ?
      <div className="row">
        <div className="col-2 border-top">
          <b>{detectorsLength ? detectorsLength + " Detectors" : ''}</b>
          {ontology.detectors?.map(detectorId =>
            <div key={"detectorId_" + ontology.ontology_id + detectorId}>
              <OntologyRichLabel ontologyId={detectorId} />
            </div>
          )}
        </div>
        <div className="col-2 border-top">
          <b>{solventsLength ? solventsLength + " Solvents" : ''}  </b>
          {ontology.solvents.map(solventId =>
            <div key={"solventId_" + ontology.ontology_id + solventId}>
              <OntologyRichLabel ontologyId={solventId} />
            </div>
          )}
        </div>
        <div className="col-6 border-top">
          <b>
            {phasesLength ? phasesLength + " Stationary Phase" : ''}
          </b>
          {ontology.stationary_phase?.map(phase =>
            <div key={"stat_phase" + ontology.ontology_id + phase}>
              {phase}
            </div>
          )}
        </div>
      </div> : <></>
  }

  const renderInfoRow = (ontology) => {
    let buttonColor = ontology?.active ? 'success' : 'condition'
    return (
      <div className="row" >
        <div className="col-2">
          <Button onClick={toggleModal} size="sm" color={buttonColor}>
            {ontology.ontology_id}
          </Button>
          <span className='ms-3' >
            <OntologyLink ontology={ontology} />
          </span>
          <div>
            {StringDecorator.toLabelSpelling(ontology.ontology_type)}
          </div>
        </div>
        <div className="col-2"><b>{ontology.label}</b></div>
        <div className="col-3"><b>{ontology.name}</b></div>
        <div className="col-5">{OntologiesInfoDecorator.rolesInfo({ ontology: ontology, ontologies: ontologies })}</div>
      </div>
    )
  }

  const isDevice = OntologyConstants.isDevice(ontology.ontology_type)

  return (
    <td key={"ontology-item-" + ontology.ontology_id}>
      {renderInfoRow(ontology)}
      {isDevice && renderDeviceInfoRow(ontology)}
      {formOpen && <OntologyFormModal key={"ontology-form-modal-" + ontology.ontology_id} ontology={ontology} isOpen onClose={toggleModal} />}
    </td>
  )
}

export default OntologyListItem;
