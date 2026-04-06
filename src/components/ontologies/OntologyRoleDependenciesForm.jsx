import React, { useState } from 'react';

import { Button, Label } from 'reactstrap';

import Select from 'react-select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DeletableItem from './DeletableItem';
import StringDecorator from '../../decorators/StringDecorator';

const OntologyRoleDependenciesForm = ({ onChange, roleName, dependencies, onDelete, roleTypeOptions, selectableOntologyOptions }) => {

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

    if (newDependencies[dependencyType].length === 0) { delete newDependencies[dependencyType] }
    onChange(newDependencies)
  }

  const renderDependency = ([dependencyType, dependsOn]) => {
    return (
      <div className="col-3" key={"dependencyType_" + dependencyType} >
        <div>available for <b>{StringDecorator.toLabelSpelling(dependencyType)}:</b>
        </div>
        {dependsOn.map(dependencyId =>
          <DeletableItem ontologyId={dependencyId} onDelete={deleteDependency(dependencyType)(dependencyId)} />)
        }
      </div>
    )
  }

  const renderDependencies = () => Object.entries(dependencies).length > 0 ? Object.entries(dependencies).map((dependency) => renderDependency(dependency)) : <>Always available</>

  const renderAddDependencyForm = () => {
    return (<>
      <div className="col-2">
        <Select
          placeholder={'Add Dependency Type'}
          className="react-select--overwrite"
          classNamePrefix="react-select"
          name="AddDependencyType"
          options={roleTypeOptions}
          selected={addDependencyType}
          isClearable
          onChange={selectedOption => setDependencyType(selectedOption?.value)}
        />
      </div>
      <div className="col-3">
        <Select
          key={"Need-to-provide-a-stupid-key-just-so-react-knows-that-it-is-now-supposed-to-do-what-it-was-actually-invented-for" + renderCountToForceStupidReactToRerenderOnStateChange}
          placeholder={'Add Dependency Ontology'}
          className="react-select--overwrite"
          classNamePrefix="react-select"
          name="AddDependencyOntology"
          options={selectableOntologyOptions}
          selected={addDependencyOntology}
          isClearable
          onChange={selectedOption => setDependencyOntology(selectedOption?.value)}
        />
      </div>
      <div className="col-1">
        <Button color="success" onClick={addDependency} disabled={!addDependencyType || !addDependencyOntology}>+ Add</Button>
      </div>
    </>)
  }

  return (
    <div className="row">
      <div className="col-2 px-3">
        <Button color="danger" onClick={onDelete} size="sm" >
          <FontAwesomeIcon icon="trash" size="sm" />
        </Button>
        <Label className="px-3">
          {StringDecorator.toLabelSpelling(roleName)}
        </Label>
      </div>
      {renderDependencies()}
      <div className="row mt-3">
        {renderAddDependencyForm()}
      </div>
    </div >

  )

}

export default OntologyRoleDependenciesForm;
