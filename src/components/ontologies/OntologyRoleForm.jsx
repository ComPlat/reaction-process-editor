import React from 'react';

import OntologyRoleDependenciesForm from './OntologyRoleDependenciesForm';

const OntologyRoleForm = ({ role, onChange, selectableOntologyOptions, roleTypeOptions }) => {
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
        <tr>
          <OntologyRoleDependenciesForm
            roleName={roleName}
            dependencies={dependencies}
            onDelete={handleDeleteRoleDependency(index)}
            onChange={handleChangeRoleDependencies(index)}
            roleTypeOptions={roleTypeOptions}
            selectableOntologyOptions={selectableOntologyOptions} />
        </tr>
      )}
    </>
  )

}

export default OntologyRoleForm;
