import React, { useContext, useState } from 'react';

import { Button, Card, Form, FormGroup, Input, Label } from 'reactstrap';

import Select from 'react-select';
import FormButtons from '../utilities/FormButtons';

import { useReactionsFetcher } from '../../fetchers/ReactionsFetcher';

import OntologyRoleForm from './OntologyRoleForm';
import OntologiesInfoDecorator from '../../decorators/OntologiesInfoDecorator';

import { SelectOptions } from "../../contexts/SelectOptions";

const OntologyForm = ({ ontology, isOpen, onFinished }) => {

  const api = useReactionsFetcher()
  const dependencyTypeOptions = ["action", "class", "type", "subtype", "detector", "condition", "device", "solvent", "mobile_phase", "material", "mode"].map(i => { return { value: i, label: i } })

  const ontologies = useContext(SelectOptions)

  const [ontologyQuery, setOntologyQuery] = useState('');

  const [currentOntology, setCurrentOntology] = useState(JSON.parse(JSON.stringify(ontology)))
  const [formOpen, setFormOpen] = useState(isOpen)

  const ontologyMatchesQuery = (ont) => {
    return ont.ontology_id?.toLowerCase().match(ontologyQuery?.toLowerCase())
      || ont.label?.toLowerCase().match(ontologyQuery?.toLowerCase())
      || ont.name?.toLowerCase().match(ontologyQuery?.toLowerCase())
  }

  const filteredOntologies = ontologies
    .filter(ont => ontologyMatchesQuery(ont))
    .map(ont => OntologiesInfoDecorator.enrichedOntologyOption(ont))

  const handleChange = (key) => (value) => setCurrentOntology(
    { ...currentOntology, [key]: value }
  )

  const changeRole = (newRole) => {
    let newOntology = JSON.parse(JSON.stringify(currentOntology))
    newOntology.roles = { ...newOntology.roles, ...newRole }
    setCurrentOntology(newOntology)
  }

  const addRole = (roleName) => {
    let newOntology = JSON.parse(JSON.stringify(currentOntology))
    let currentRole = newOntology.roles[roleName] || []

    newOntology.roles[roleName] = currentRole.concat([{}])
    setCurrentOntology(newOntology)
  }

  const deleteRole = (index) => () => {
    let newOntology = JSON.parse(JSON.stringify(currentOntology))
    newOntology.roles = newOntology.roles.toSpliced(index, 1)
    setCurrentOntology(newOntology)
  }

  const handleCancel = () => {
    setCurrentOntology(JSON.parse(JSON.stringify(ontology)))
    setFormOpen(false)
    onFinished && onFinished()
  }
  const handleSave = () => {
    api.saveOntology(currentOntology)
    setFormOpen(false)
    onFinished && onFinished()
  }

  const renderRolesDependenciesForm = () => {
    return (
      <div className="row">
        {Object.entries(currentOntology.roles).map((role, index) => {
          return (
            <OntologyRoleForm
              key={"ontology-role-form-" + index}
              role={role} selectableOntologyOptions={filteredOntologies} onChange={changeRole} onDelete={deleteRole(index)} dependencyTypeOptions={dependencyTypeOptions} />
          )
        })
        }
      </div>
    )
  }

  const renderForm = () => {
    return (
      <Card className="procedure-card procedure-card--action"
      >
        <div className=''>
          <Form>
            <FormGroup floating >
              <Input
                label={"Ontology-id"}
                type="textfield"
                value={currentOntology.ontology_id}

                onChange={event => handleChange('ontology_id')(event.target.value)}
                disabled={!!ontology.id}
              />
              <Label>Ontology ID</Label>
            </FormGroup>
            <FormGroup floating  >
              <Input className='col-1'
                type="checkbox"
                checked={currentOntology.active}
                onChange={event => handleChange('active')(event.target.checked)}
              />
              <Label>Active</Label>
            </FormGroup >
            <FormGroup floating >
              <Input
                type="textfield"
                value={currentOntology.label}
                placeholder="Label"
                onChange={event => handleChange('label')(event.target.value)}
              />
              <Label>Label</Label>
            </FormGroup>
            <FormGroup floating >
              <Input
                label={"Name"}
                type="textfield"
                value={currentOntology.name}
                placeholder="Name"
                onChange={event => handleChange('name')(event.target.value)}
              />
              <Label>Name</Label>
            </FormGroup>
            <FormGroup floating >
              <Input
                label={"Link"}
                type="textfield"
                value={currentOntology.link}
                placeholder="Link"
                onChange={event => handleChange('link')(event.target.value)}
              />
              <Label>Link</Label>
            </FormGroup>
            <FormGroup floating className="bg-dark" color="primary" >
              <div className="bg-success">
                <Select
                  placeholder={'Add Role'}
                  className="bg-primary form-select-border-success  form-select-color-success"
                  options={dependencyTypeOptions}
                  value={''}
                  onChange={selectedOption => addRole(selectedOption.value)}

                />
              </div>
            </FormGroup>
            <Input
              className={'bg-preparation'}
              placeholder={'Filter selectable Ontology options'}
              value={ontologyQuery}
              onChange={(event) => setOntologyQuery(event.target.value)}
            />
            {renderRolesDependenciesForm()}
            <FormButtons
              onCancel={handleCancel}
              onSave={handleSave}
            >
            </FormButtons>
          </Form>
        </div >
      </Card >
    )
  }

  const renderInfo = (ontology) => {
    let buttonColor = ontology?.active ? 'success' : 'danger'
    return (
      <>
        <div className="col-1 col-form-label bb-1">
          <Button onClick={e => setFormOpen(true)} size="sm" color={buttonColor}>
            {ontology.ontology_id}
          </Button>
        </div>
        <div className="col-2">{ontology.label}</div>
        <div className="col-2">{ontology.name}</div>
        <div className="col-6">{OntologiesInfoDecorator.rolesInfo({ ontology: ontology, ontologies: ontologies })}</div>
        <div className="col-4 border-top border-style-dashed">
          {ontology.detectors?.length ? "Detectors" : ''}
          {ontology.detectors?.map(detectorId => <div key={"detectorId" + detectorId}>
            {OntologiesInfoDecorator.infoLabelForId({ ontologyId: detectorId, ontologies: ontologies })}
          </div>
          )}
        </div>
        <div className="col-4 border-top">
          {ontology.solvents.length ? "Solvents" : ''}
          {ontology.solvents.map(solventId => <div key={"solventId_" + solventId}>
            {OntologiesInfoDecorator.infoLabelForId({ ontologyId: solventId, ontologies: ontologies })}
          </div>
          )}
        </div>
        <div className="col-4 border-top">
          {ontology.stationary_phase?.length ? "Stationary Phase" : ''}
          {ontology.stationary_phase?.map(phase => <div key={"stat_pgase" + phase}>
            {phase}
          </div>
          )}
        </div>
      </>
    )
  }
  return (
    <div className="row px-5 border" >
      {formOpen ? renderForm(ontology) : renderInfo(ontology)}
    </div>
  )
}

export default OntologyForm;
