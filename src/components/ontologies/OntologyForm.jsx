import React, { useContext, useState } from 'react';

import { Button, Card, Form, FormGroup, Input } from 'reactstrap';

import Select from 'react-select';
import FormButtons from '../utilities/FormButtons';

import { useReactionsFetcher } from '../../fetchers/ReactionsFetcher';

import OntologyRoleForm from './OntologyRoleForm';
import OntologiesInfoDecorator from '../../decorators/OntologiesInfoDecorator';


import { SelectOptions } from "../../contexts/SelectOptions";



const OntologyForm = ({ ontology, customClass, showEditBtn = true, type = 'condition' }) => {

  const api = useReactionsFetcher()
  const dependencyTypeOptions = ["action", "class", "type", "subtype", "detector", "condition", "device", "solvent", "mobile_phase", "material", "mode"].map(i => { return { value: i, label: i } })

  const ontologies = useContext(SelectOptions)

  const handleChange = (key) => (value) => setCurrentOntology(
    { ...currentOntology, [key]: value }
  )

  const addRole = (roleName) => {
    let newOntology = { ...currentOntology }
    // let newRole = {}
    // newRole[roleName] = []
    console.log("ADD ROLE to current")
    console.log(roleName)
    console.log(currentOntology)
    let currentRole = currentOntology.roles[roleName] || []
    // currentRole.push(newRole)
    newOntology.roles[roleName] = currentRole.concat([{}])
    console.log(newOntology)
    setCurrentOntology(newOntology)
  }
  const removeRole = (index) => { }

  const [currentOntology, setCurrentOntology] = useState(ontology)
  const [disabled, setDisabled] = useState(true)


  const resetOntologyForm = () => {
    setCurrentOntology(ontology)
    setDisabled(true)
  }
  const handleSave = () => {
    api.saveOntology(currentOntology)
    setDisabled(true)
  }

  // const renderRole = ([roleName, role]) => {
  //   return (
  //     <OntologyRoleForm role={role} disabled={disabled} />
  //     // <div>
  //     //   {roleName}
  //     //   {role.map(dependency => { return renderDependency(dependency) })}
  //     // </div>
  //   )
  // }

  const renderForm = () => {
    return (
      <Card className={
        "procedure-card procedure-card--" + type + "" + customClass +
        (showEditBtn ? " procedure-card--editable" : "")
      }
      >
        <div className=''>
          <Form>
            <FormGroup>
              <Input className='col-1'
                disabled={disabled}
                type="checkbox"
                checked={currentOntology.active}
                onChange={event => handleChange('active')(event.target.checked)}
              /> Active
              <Input
                disabled={disabled}

                label={"Ontoloogy-id"}
                type="textfield"
                value={currentOntology.ontology_id}
                placeholder="Ontogolgy-Id"
                onChange={event => handleChange('ontology_id')(event.target.value)}
              />
              <Input
                disabled={disabled}

                label={"Ontology-id"}
                type="textfield"
                value={currentOntology.label}
                placeholder="Label"
                onChange={event => handleChange('label')(event.target.value)}
              />
              <Input
                disabled={disabled}
                label={"Name"}
                type="textfield"
                value={currentOntology.name}
                placeholder="Name"
                onChange={event => handleChange('name')(event.target.value)}
              />
              <Input
                disabled={disabled}
                label={"Link"}
                type="textfield"
                value={currentOntology.link}
                placeholder="Link"
                onChange={event => handleChange('link')(event.target.value)}
              />
            </FormGroup>
            <div className="col-2">
              <Select
                placeholder={'Add Role'}
                className="react-select--overwrite filtration-step-form__solvent-select"
                classNamePrefix="react-select"
                name="purification_solvent_solvent_ids"
                options={dependencyTypeOptions}
                value={''}
                onChange={selectedOption => addRole(selectedOption.value)}
                isDisabled={disabled}
              />

            </div>
            <div className="row">
              {Object.entries(ontology.roles).map(role => {
                return (
                  <div className="col-6">
                    <OntologyRoleForm role={role} disabled={disabled} />
                  </div>
                )
              })
              }
            </div>
            <FormButtons
              onCancel={resetOntologyForm}
              onSave={handleSave}
            />
          </Form>


        </div>
      </Card >
    )
  }

  const renderInfo = (ontology) => {
    let buttonColor = ontology?.active ? 'success' : 'danger'
    return (
      <>
        <div className="col-1 col-form-label bb-1">
          <Button onClick={e => setDisabled(false)} size="sm" color={buttonColor}>
            {ontology.ontology_id}
          </Button>
        </div>
        {/* <div className="col-2">{ontology.ontology_id}</div> */}
        <div className="col-2">{ontology.label}</div>
        <div className="col-2">{ontology.name}</div>
        <div className="col-6">{OntologiesInfoDecorator.rolesInfo({ ontology: ontology, ontologies: ontologies })}</div>
        <div className="col-4 border-top border-style-dashed">
          {ontology.detectors.length ? "Detectors" : ''}
          {ontology.detectors.map(detectorId => <div>
            {OntologiesInfoDecorator.infoLabelForId({ ontologyId: detectorId, ontologies: ontologies })}
          </div>
          )}
        </div>
        <div className="col-4 border-top">
          {ontology.solvents.length ? "Solvents" : ''}
          {ontology.solvents.map(solventId => <div>
            {OntologiesInfoDecorator.infoLabelForId({ ontologyId: solventId, ontologies: ontologies })}
          </div>
          )}
        </div>
        <div className="col-4 border-top">
          {ontology.stationary_phase.length ? "Stationary Phase" : ''}
          {ontology.stationary_phase.map(phase => <div>
            {phase}
          </div>
          )}
        </div>


        {/* <div className="col-1">A</div>
        <div className="col-1">A</div>
        <div className="col-1">A</div>
        <div className="col-1">A</div>
        <div className="col-1">A</div>
        <div className="col-1">A</div>
        <div className="col-1">A</div>
        <div className="col-1">A</div> */}
      </>
    )
  }

  return (
    <div className="row px-5 border" >
      {disabled ? renderInfo(ontology)
        :
        renderForm(ontology)
      }
    </div>
  )

}

export default OntologyForm;


// optional: id
// requires: active, type: Boolean
// requires: ontology_id
// requires: label
// optional: name
// optional: link
// requires: roles, type: Hash
// optional: solvents, type: Array
// optional: detectors, type: Array
// optional: stationary_phase, type: Array
