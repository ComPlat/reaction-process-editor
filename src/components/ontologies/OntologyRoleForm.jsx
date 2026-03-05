import React, { useState } from 'react';

import { Button, Card, Form, FormGroup, Input } from 'reactstrap';

import Select from 'react-select';
import FormButtons from '../utilities/FormButtons';

import { useReactionsFetcher } from '../../fetchers/ReactionsFetcher';




const OntologyRoleForm = ({ role, disabled }) => {

  const [roleName, dependencies] = role

  console.log("RoleForm")
  console.log(role)
  console.log(roleName)
  console.log(dependencies)

  // const api = useReactionsFetcher()
  const dependencyTypeOptions = ["action", "class", "type", "subtype", "detector", "condition", "device", "solvent", "mobile_phase", "material", "mode"].map(i => { return { value: i, label: i } })

  // console.log("ontology")
  // console.log(ontology)

  // const handleChange = (key) => (value) => setCurrentOntology(
  //   { ...currentOntology, [key]: value }
  // )

  const handleChange = () => { }

  const addDependency = (dependencyId) => { }
  const removeDependency = (dependencyId) => { }

  // const [currentOntology, setCurrentOntology] = useState(ontology)


  const renderDependency = (dependency) => {
    console.log("dependency")
    console.log(dependency)
    return (
      <>
        {Object.entries(dependency).map(([dependencyType, dependsOn]) => {
          return (
            <>
            <>RoleForm</>
              <>{dependencyType}</>
              <Select
                options={dependencyTypeOptions}
                selected={{value: dependencyType, label: dependencyType}}
                onChange={handleChange}
                isDisabled={disabled}
                isMulti
              />
              {dependsOn.map(dep => {
                return (<>{dep}</>)
              })
              }
              <br />
            </>
          )
        })
        }
        {/* {dependency.map(parent => {
          return parent
        })} */}
      </>
    )
  }

  // const currentRole = OptionsDecorator

  return (
    <div>
      {"Role"}
      <Select
        value={{value: roleName, label: roleName}}
        options={dependencyTypeOptions}
        isDisabled={disabled }
      />
      {"Depends on:"}
      {dependencies.map(dependency => { return renderDependency(dependency) })}
      <Select
        placeholder={'Add Dependency'}
        className="react-select--overwrite filtration-step-form__solvent-select"
        classNamePrefix="react-select"
        name="purification_solvent_solvent_ids"
        options={dependencyTypeOptions}
        value={''}
        onChange={selectedOption => addDependency(selectedOption)}
        isDisabled={disabled}
      />
    </div>
  )

}

export default OntologyRoleForm;


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
