import React, { useContext, useState } from 'react';

import { Button, FormGroup, Label } from 'reactstrap';

import Select from 'react-select';

import OntologiesOptionsDecorator from '../../decorators/OntologiesOptionsDecorator';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SelectOptions } from '../../contexts/SelectOptions';

const OntologyRoleDependenciesForm = ({ onChange, roleName, dependencies, onDelete, disabled, dependencyTypeOptions, selectableOntologyOptions }) => {

  let ontologyOptions = useContext(SelectOptions)

  const [addDependencyType, setDependencyType] = useState()
  const [addDependencyOntology, setDependencyOntology] = useState()
  const [renderCountToForceStupidReactToRerenderOnStateChange, setRenderCount] = useState(0);

  const addDependency = () => {
    let newDependencies = JSON.parse(JSON.stringify(dependencies))

    newDependencies[addDependencyType] ||= []
    newDependencies[addDependencyType].push(addDependencyOntology)
    setDependencyOntology(null)
    setRenderCount(renderCountToForceStupidReactToRerenderOnStateChange + 1)
    onChange(newDependencies)
  }

  const deleteDependency = (dependencyType) => (ontologyId) => () => {
    let newDependencies = JSON.parse(JSON.stringify(dependencies))

    let index = dependencies[dependencyType].indexOf(ontologyId);
    if (index > -1) { newDependencies[dependencyType] = dependencies[dependencyType].toSpliced(index, 1); }
    onChange(newDependencies)
  }

  const renderDependency = ([dependencyType, dependsOn]) => {
    return (
      <div key={"dependencyType_" + dependencyType} >
        <div>{dependencyType} is any of:</div>
        {dependsOn.map(dependency => {
          let ontology = OntologiesOptionsDecorator.findByOntologyId({ ontologyId: dependency, ontologies: ontologyOptions })

          return (
            <div key={"depdendency_" + dependency}
            >
              <Button color="danger" onClick={deleteDependency(dependencyType)(dependency)} disabled={disabled} size="sm" className="mt-1 mx-3">
                <FontAwesomeIcon icon="trash" size="sm" />
              </Button>
              {ontology?.ontology_id + ' ' + (ontology?.label || ontology?.name)}
            </div>)
        })
        }
      </div>
    )
  }

  return (
    <>
      <FormGroup className="mt-3">
        <Button color="danger" onClick={onDelete} size="sm" >
          <FontAwesomeIcon icon="trash" size="sm" />
        </Button>
        <Label className="px-3">
          Role: {roleName}
        </Label>
        <div>
          {Object.entries(dependencies).length ? "Available if: " : "Always available (no dependencies)"}
        </div>
      </FormGroup>
      <div className="px-5">
        {Object.entries(dependencies).map((dependency) => renderDependency(dependency))}
      </div>
      <FormGroup className="mt-5 success">
        <Select
          placeholder={'Add Dependency: Type'}
          className="react-select--overwrite filtration-step-form__solvent-select"
          classNamePrefix="react-select"
          name="AddDependencyType"
          options={dependencyTypeOptions}
          selected={addDependencyType}
          onChange={selectedOption => setDependencyType(selectedOption.value)}
        />
        <Select
          key={"Need-to-provide-a-stupid-key-just-so-react-knows-that-it-is-supposed-to-do-what-it-was-invented-for" + renderCountToForceStupidReactToRerenderOnStateChange}
          placeholder={'Add Dependency: Ontology'}
          className="react-select--overwrite filtration-step-form__solvent-select"
          classNamePrefix="react-select"
          name="AddDependencyOntology"
          options={selectableOntologyOptions}
          selected={addDependencyOntology}
          onChange={selectedOption => setDependencyOntology(selectedOption.value)}
        />
      </FormGroup>
      <Button onClick={addDependency} disabled={!addDependencyType || !addDependencyOntology}>+ Add Dependency</Button>
    </>
  )

}

export default OntologyRoleDependenciesForm;
