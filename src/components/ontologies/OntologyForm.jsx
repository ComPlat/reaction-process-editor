import React, { useState } from 'react';

import { Button, Card, Form, FormGroup, Input } from 'reactstrap';

import Select from 'react-select';
import FormButtons from '../utilities/FormButtons';

import { useReactionsFetcher } from '../../fetchers/ReactionsFetcher';

import OntologyRoleForm from './OntologyRoleForm';

const OntologyForm = ({ ontology, customClass, showEditBtn = true, type = 'condition' }) => {

  const api = useReactionsFetcher()
  const dependencyTypeOptions = ["action", "class", "type", "subtype", "detector", "condition", "device", "solvent", "mobile_phase", "material", "mode"].map(i => { return { value: i, label: i } })

  console.log("ontology")
  console.log(ontology)

  const handleChange = (key) => (value) => setCurrentOntology(
    { ...currentOntology, [key]: value }
  )

  const addRole = (dependencyId) => { }
  const removeDependency = (dependencyId) => { }

  const [currentOntology, setCurrentOntology] = useState(ontology)
  const [disabled, setDisabled] = useState(false)




  // const renderDependency = (dependency) => {
  //   console.log("dependency")
  //   console.log(dependency)
  //   return (
  //     <>
  //       {Object.entries(dependency).map(([dependencyType, dependsOn]) => {
  //         return (
  //           <>
  //             <Select
  //               options={dependencyTypeOptions}
  //               selected={dependencyType}
  //               onChange={handleChange}
  //             />
  //             {dependsOn.map(dep => {
  //               return (<>{dep}</>)
  //             })
  //             }
  //             <br />
  //           </>
  //         )
  //       })
  //       }
  //       {/* {dependency.map(parent => {
  //         return parent
  //       })} */}
  //     </>
  //   )
  // }
  const resetOntologyForm = () => {
    setCurrentOntology(ontology)
    setDisabled(true)
  }
  const handleSave = () => {
    api.saveOntology(currentOntology)
    setDisabled(true)
  }

  const renderRole = ([roleName, role]) => {
    return (
      <OntologyRoleForm role={role} disabled={disabled} />
      // <div>
      //   {roleName}
      //   {role.map(dependency => { return renderDependency(dependency) })}
      // </div>
    )
  }

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
            />
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
          {"Roles: "}
          {Object.entries(ontology.roles).map(role => {
            return <OntologyRoleForm role={role} disabled={disabled} />
          })
          }
          <Select
            placeholder={'Add Role'}
            className="react-select--overwrite filtration-step-form__solvent-select"
            classNamePrefix="react-select"
            name="purification_solvent_solvent_ids"
            options={dependencyTypeOptions}
            value={''}
            onChange={selectedOption => addRole(selectedOption)}
            isDisabled={disabled}
          />

          {disabled ?
            <Button onClick={e => setDisabled(false)} >
              Edit
            </Button>
            :
            <FormButtons
              onCancel={resetOntologyForm}
              onSave={handleSave}
            />
          }
        </Form>


      </div>
    </Card >
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
