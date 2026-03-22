import React, { useContext, useState } from 'react';

import { Button, Card, Form, FormGroup, Input } from 'reactstrap';

import Select from 'react-select';
import FormButtons from '../utilities/FormButtons';

import { useReactionsFetcher } from '../../fetchers/ReactionsFetcher';

import OntologyRoleDependencyForm from './OntologyRoleDependencyForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SelectOptions } from '../../contexts/SelectOptions';

const OntologyRoleForm = ({ role, disabled }) => {

  const ontologyOptions = useContext(SelectOptions)
  const [roleName, dependencies] = role


  // const api = useReactionsFetcher()
  // const dependencyTypeOptions = ["action", "class", "type", "subtype", "detector", "condition", "device", "solvent", "mobile_phase", "material", "mode"].map(i => { return { value: i, label: i } })

  const handleChange = () => { }

  const handleDelete = () => { }

  const addDependency = (dependencyId) => { }
  const removeDependency = (dependencyId) => { }

  // const [currentOntology, setCurrentOntology] = useState(ontology)

  // const renderDependency = (dependency) => {
  //   console.log("dependency")
  //   console.log(dependency)

  //   return (
  //     <>
  //       {Object.entries(dependency).length ? "Depends on: " : "Always"}

  //       {Object.entries(dependency).map(([dependencyType, dependsOn]) => {
  //         return (
  //           <>
  //             <>{dependencyType}</>
  //             <Select
  //               options={dependencyTypeOptions}
  //               value={{ value: dependencyType, label: dependencyType }}
  //               onChange={handleChange}
  //               isDisabled={disabled}
  //             />
  //             {dependsOn.map(dep => {
  //               return (<Select
  //                 options={dependencyTypeOptions}
  //                 value={{ value: dep, label: dep }}
  //                 onChange={handleChange}
  //                 isDisabled={disabled}
  //               />)
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

  // const currentRole = OptionsDecorator

  return (
    <div>
      <Button color="danger" onClick={handleDelete} disabled={disabled} size="sm" className="m-3">
        <FontAwesomeIcon icon="trash" size="sm" />
      </Button>
      Role: {roleName}

      <div className="row">

        {dependencies.map(dependency => {
          return (
            <div className="col-6">
              <OntologyRoleDependencyForm dependency={dependency} />
              <Select
                placeholder={'Add Dependency'}
                className="react-select--overwrite filtration-step-form__solvent-select"
                classNamePrefix="react-select"
                name="purification_solvent_solvent_ids"
                options={ontologyOptions}
                value={''}
                onChange={selectedOption => addDependency(selectedOption)}
                isDisabled={disabled}
              />
            </div>
          )
        })}
      </div>
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
