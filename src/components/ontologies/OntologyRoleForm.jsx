import React from 'react';

import OntologyRoleDependenciesForm from './OntologyRoleDependenciesForm';

const OntologyRoleForm = ({ role, onChange, selectableOntologyOptions, dependencyTypeOptions }) => {

  const [roleName, roleDependencies] = role

  const handleChangeRoleDependencies = (index) => (newRoleDependency) => {
    let newDependencies = JSON.parse(JSON.stringify(roleDependencies))
    newDependencies[index] = newRoleDependency
    onChange({ [roleName]: newDependencies })
  }

  const handleDeleteRoleDependency = (index) => () => {
    let newDependencies = roleDependencies.toSpliced(index, 1)
    onChange({ [roleName]: newDependencies })
  }

  return (
    <>
      {roleDependencies.map((dependencies, index) =>
        <div className="col-3 border">
          <OntologyRoleDependenciesForm
            roleName={roleName}
            dependencies={dependencies}
            onDelete={handleDeleteRoleDependency(index)}
            onChange={handleChangeRoleDependencies(index)}
            dependencyTypeOptions={dependencyTypeOptions}
            selectableOntologyOptions={selectableOntologyOptions} />
        </div>
      )}
    </>
  )

}

export default OntologyRoleForm;
