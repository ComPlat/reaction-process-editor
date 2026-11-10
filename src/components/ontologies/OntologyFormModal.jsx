import React, { useContext, useState } from 'react';

import { Card, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Select from 'react-select';
import FormButtons from '../utilities/FormButtons';

import EditableItemList from './EditableItemList';
import EditableTextList from './EditableTextList';
import OntologyLink from './OntologyLink';
import OntologyRichLabel from './OntologyRichLabel';
import OntologyRoleForm from './OntologyRoleForm';

import OntologiesInfoDecorator from '../../decorators/OntologiesInfoDecorator';
import OptionsDecorator from '../../decorators/OptionsDecorator';
import OntologiesOptionsDecorator from '../../decorators/OntologiesOptionsDecorator';

import { OntologyConstants } from '../../constants/OntologyConstants';
import { tooltips } from '../../constants/translations';

import { SelectOptions } from "../../contexts/SelectOptions";
import { useReactionsFetcher } from '../../fetchers/ReactionsFetcher';

const addRoleOptions = OntologyConstants.roleTypeOptions.filter(
  ({ value }) => !['action', 'class'].includes(value)
)

const OntologyFormModal = ({ ontology, isOpen, onClose }) => {

  const api = useReactionsFetcher()

  const ontologies = useContext(SelectOptions).ontologies

  const [ontologyQuery, setOntologyQuery] = useState('');
  const [selectedOntologyOption, setSelectedOntologyOption] = useState(null);

  const [currentOntology, setCurrentOntology] = useState(JSON.parse(JSON.stringify(ontology)))

  const ontologyMatchesQuery = (ont) => {
    return ont.ontology_id?.toLowerCase().match(ontologyQuery?.toLowerCase())
      || ont.label?.toLowerCase().match(ontologyQuery?.toLowerCase())
      || ont.name?.toLowerCase().match(ontologyQuery?.toLowerCase())
  }

  const filteredOntologyOptions = ontologies
    .filter(ont => ontologyMatchesQuery(ont))
    .map(ont => ({
      ...OntologiesInfoDecorator.richLabelOption(ont),
      roles: ont.roles,
    }))

  const handleChange = (key) => (value) => {
    setCurrentOntology({ ...currentOntology, [key]: value }
    )
  }

  const ontologyIdExists = !ontology.id && OntologiesOptionsDecorator.findByOntologyId({ ontologyId: currentOntology.ontology_id, ontologies: ontologies })

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
    onClose()
  }
  const handleSave = () => {
    api.saveOntology(currentOntology)
    !currentOntology.ontology_id && setCurrentOntology(JSON.parse(JSON.stringify(ontology)))
    onClose()
  }

  const renderDeviceFields = () => {
    return (
      <div className="row bg-condition bg-opacity-25">
        <div className="col-4 border pb-3"  >
          <EditableItemList label={'Detector'} items={currentOntology.detectors} onChange={handleChange('detectors')} options={filteredOntologyOptions} />
        </div>
        <div className="col-4 border pb-3"  >
          <EditableItemList label={'Solvent'} items={currentOntology.solvents} onChange={handleChange('solvents')} options={filteredOntologyOptions} />
        </div>
        <div className="col-4 border pb-3"  >
          <EditableTextList label={'Stationary Phase'} items={currentOntology.stationary_phase} onChange={handleChange('stationary_phase')} />
        </div>
      </div>
    )
  }
  const renderRolesDependenciesForm = () => {
    return (
      <div className="d-flex align-items-start gap-3">
        <FormGroup className="ontology-form__add-role mt-3 flex-shrink-0">
          <Select
            placeholder={'Add Role'}
            className="bg-primary react-select--overwrite"
            classNamePrefix="react-select"
            options={addRoleOptions}
            value={null}
            onChange={selectedOption => addRole(selectedOption?.value)}
          />
        </FormGroup>
        <div className="ontology-form__dependencies flex-grow-1">
          <table className='table table-striped table-primary'>
            <tbody>
              {Object.entries(currentOntology.roles).map((role, index) => {
                return (
                  <OntologyRoleForm
                    key={"ontology-role-form-" + index}
                    role={role}
                    onChange={changeRole}
                    onDelete={deleteRole(index)}
                    selectableOntologyOptions={filteredOntologyOptions}
                    roleTypeOptions={OntologyConstants.roleTypeOptions} />
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderDuplicateIdWarning = () => {
    return (
      <div title={tooltips['duplicate_ontology_id']}>
          <FontAwesomeIcon icon={"circle-info"} className={'icon-button icon-button--positive bg-danger'} />
      </div>
    )
  }

  const renderMainFields = () => {
    return (<>
      <div className='row'>
        <FormGroup className="col-2">
          <Select
            className="mt-3 react-select--overwrite"
            classNamePrefix="react-select"
            value={OptionsDecorator.optionForValue(currentOntology.ontology_type, OntologyConstants.ontologyTypeOptions)}
            options={OntologyConstants.ontologyTypeOptions}
            onChange={selected => handleChange('ontology_type')(selected.value)}
          />
        </FormGroup >
        <FormGroup className="col-1 my-3">
          <Input
            className='m-3'
            type="checkbox"
            checked={currentOntology.active}
            onChange={event => handleChange('active')(event.target.checked)}
          />
          <Label className='my-2'>Active</Label>
        </FormGroup >
        <FormGroup className="col-9">
          <FormButtons
            onCancel={handleCancel}
            onSave={handleSave}
            disableSave={ontologyIdExists}
          />
        </FormGroup >
      </div>
      <div className="row">
        <FormGroup floating className="col-3">
          <Input
            type="textfield"
            value={currentOntology.ontology_id}
            onChange={event => handleChange('ontology_id')(event.target.value)}
            disabled={!!ontology.id}
          />
          <Label className="mx-3">Ontology ID</Label>
          {ontologyIdExists && renderDuplicateIdWarning()}
        </FormGroup>
        <FormGroup floating className="col-3">
          <Input
            type="textfield"
            value={currentOntology.label || ''}
            placeholder="Label"
            onChange={event => handleChange('label')(event.target.value)}
          />
          <Label className="mx-3">Label</Label>
        </FormGroup>
        <div className="col-6 d-flex ">
          <div className='m-3' >
            <OntologyLink ontology={currentOntology} />
          </div>
          <FormGroup floating className="flex-grow-1"  >
            <Input
              type="textfield"
              value={currentOntology.link}
              placeholder="URL"
              onChange={event => handleChange('link')(event.target.value)}
            />
            <Label className="mx-3">URL</Label>
          </FormGroup>
        </div>
      </div>
      <div className='row'>
        <FormGroup floating className="col-12">
          <Input
            type="textfield"
            value={currentOntology.name || ''}
            placeholder="Name"
            onChange={event => handleChange('name')(event.target.value)}
          />
          <Label className="mx-3">Name</Label>
        </FormGroup>
      </div>
    </>)
  }

  const renderOntologiesFilter = () => {
    return (
      <div className='d-flex align-items-center gap-3 w-100'>
        <div className='flex-shrink-0'>{modalTitle}</div>
        <Input
          className='bg-preparation bg-opacity-25 flex-grow-1'
          placeholder='Filter selectable Ontology options'
          title='Filter the Ontologies in the Select Fields for a better overview.'
          value={ontologyQuery}
          onChange={(event) => setOntologyQuery(event.target.value)}
        />
        <div
          className='ontology-form__filtered-options'
          title='Show filtered Ontology-terms as available in all Select fields of this form for an overview.'
        >
          <Select
            aria-label='Filtered Ontologies'
            className='react-select--overwrite'
            classNamePrefix='react-select'
            options={filteredOntologyOptions}
            value={selectedOntologyOption}
            placeholder={`Selectable: ${filteredOntologyOptions.length} / ${ontologies.length}`}
            isClearable
            onChange={setSelectedOntologyOption}
          />
        </div>
      </div>)
  }


  const modalTitle = !!ontology.id ?
    <>Edit Ontology -- <OntologyRichLabel ontology={ontology} /></> : 'Create Ontology'

  return (
    <Modal
      className={'d-flex align-items-center justify-content-center modal--primary modal-fullscreen'}
      isOpen={isOpen}
      autoFocus={true}
      toggle={onClose}
      backdrop={"static"}
    >
      <ModalHeader tag='div' className='d-block'>{renderOntologiesFilter()}</ModalHeader>
      <ModalBody>
        <Card className="procedure-card procedure-card--info">
          <Form className='m-3'>
            {renderMainFields()}
            {renderRolesDependenciesForm()}
            {OntologyConstants.isDevice(currentOntology.ontology_type) && renderDeviceFields()}
            <FormButtons
              onCancel={handleCancel}
              onSave={handleSave}
              disableSave={ontologyIdExists}
            />
          </Form>
        </Card >
      </ModalBody>
    </Modal>
  )
}

export default OntologyFormModal;
