import React, { useContext, useState } from 'react';

import { Button, Card, Form, FormGroup, Input } from 'reactstrap';

import Select from 'react-select';
import FormButtons from '../utilities/FormButtons';

import { useReactionsFetcher } from '../../fetchers/ReactionsFetcher';

import OntologiesOptionsDecorator from '../../decorators/OntologiesOptionsDecorator';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SelectOptions } from '../../contexts/SelectOptions';

const OntologyRoleDependencyForm = ({ dependency, disabled }) => {

  let ontologyOptions = useContext(SelectOptions)

  const handleChange = () => { }

  const handleDelete = () => { }

  const addDependency = (dependencyId) => { }
  const removeDependency = (dependencyId) => { }

  // const [currentOntology, setCurrentOntology] = useState(ontology)

  const renderDependency = (dependency) => {
    console.log("dependency")
    console.log(dependency)

    let selectedOption = OntologiesOptionsDecorator.findByOntologyId({ ontologyId: dependency, ontologies: ontologyOptions })

    return (
      <>
        {Object.entries(dependency).length ? "Available for: " : "Always available (no dependencies)"}

        {Object.entries(dependency).map(([dependencyType, dependsOn]) => {
          return (
            <>
              <div>When {dependencyType} one of:</div>

              {dependsOn.map(dependency => {

                let ontology = OntologiesOptionsDecorator.findByOntologyId({ ontologyId: dependency, ontologies: ontologyOptions })
                return (
                  <div>
                    <Button color="danger" onClick={handleDelete()} disabled={disabled} size="sm" className="m-3">
                      <FontAwesomeIcon icon="trash" size="sm" />
                    </Button>
                    {ontology?.ontology_id + ' ' + ontology?.label}
                  </div>)
              })
              }
              <br />
            </>
          )
        })
        }
      </>
    )
  }

  // const currentRole = OptionsDecorator

  return (
    <div>
      {renderDependency(dependency)}
    </div>
  )

}

export default OntologyRoleDependencyForm;


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
