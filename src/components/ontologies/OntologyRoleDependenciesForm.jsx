import React, { useState } from 'react';

import { Button, Input, Label } from 'reactstrap';

import Select from 'react-select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DeletableItem from './DeletableItem';
import StringDecorator from '../../decorators/StringDecorator';
import { OntologyConstants } from '../../constants/OntologyConstants';

const automationModeOptions = [
  { label: 'Manual', value: OntologyConstants.automation_mode.manual },
  { label: 'Semi Automated', value: OntologyConstants.automation_mode.semiAutomated },
  { label: 'Automated', value: OntologyConstants.automation_mode.automated },
]

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

  const selectedAutomationModes = dependencies.automation_mode
    || automationModeOptions.map(({ value }) => value)

  const toggleAutomationMode = (automationMode) => (event) => {
    let newDependencies = JSON.parse(JSON.stringify(dependencies))
    let newAutomationModes = selectedAutomationModes.filter(mode => mode !== automationMode)

    if (event.target.checked) {
      newAutomationModes.push(automationMode)
    }

    if (newAutomationModes.length === automationModeOptions.length) {
      delete newDependencies.automation_mode
    } else {
      newDependencies.automation_mode = newAutomationModes
    }

    onChange(newDependencies)
  }

  const renderDependency = ([dependencyType, dependsOn]) => {
    return (
      <div className="col-4" key={"dependencyType_" + dependencyType} >
        <div>available for <b>{StringDecorator.toLabelSpelling(dependencyType)}:</b>
        </div>
        {dependsOn.map(dependencyId =>
          <DeletableItem ontologyId={dependencyId} onDelete={deleteDependency(dependencyType)(dependencyId)} />)
        }
      </div>
    )
  }

  const otherDependencies = Object.entries(dependencies)
    .filter(([dependencyType]) => dependencyType !== 'automation_mode')

  const renderDependencies = () => otherDependencies.length > 0 ?
    otherDependencies.map((dependency) => renderDependency(dependency)) :
    <>No dependencies (always selectable)</>

  const renderAutomationModes = () => (
    <div className="mt-2">
      {automationModeOptions.map(({ label, value }) => (
        <Label className="d-flex align-items-center gap-2 mb-1" key={value}>
          <Input
            checked={selectedAutomationModes.includes(value)}
            onChange={toggleAutomationMode(value)}
            type="checkbox"
          />
          {label}
        </Label>
      ))}
    </div>
  )

  const renderAddDependencyForm = () => {
    return (
      <div className="col-3 d-flex flex-column gap-2">
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
        <Button
          className="align-self-end"
          color="success"
          onClick={addDependency}
          disabled={!addDependencyType || !addDependencyOntology}
        >
          + Add
        </Button>
      </div>
    )
  }

  return (
    <div className="row">
      <div className="col-2 px-3">
        <Button color="danger" onClick={onDelete} size="sm" >
          <FontAwesomeIcon icon="trash" size="sm" />
        </Button>
        <span className="px-3">
          {"Acts as: "}
          <Label >
            {StringDecorator.toLabelSpelling(roleName)}
          </Label>
        </span>
        {renderAutomationModes()}
      </div>
      <div className="col">
        <div className="row">
          {roleName === 'unused' ? <>Never available</> : renderDependencies()}
        </div>
      </div>
      {roleName === 'unused' || renderAddDependencyForm()}
    </div >
  )
}

export default OntologyRoleDependenciesForm;
