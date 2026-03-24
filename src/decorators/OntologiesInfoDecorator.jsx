import OntologiesOptionsDecorator from "./OntologiesOptionsDecorator"

export default class OntologiesInfoDecorator {

  static id = (ontology) => ontology?.ontology_id
  static label = (ontology) => ontology?.label
  static name = (ontology) => ontology?.name
  static link = (ontology) => ontology?.link

  static infoLabelForId = ({ ontologyId, ontologies }) => {

    let ontology = OntologiesOptionsDecorator.findByOntologyId({ ontologyId: ontologyId, ontologies: ontologies })

    return '' + ontologyId + ' [' + (ontology?.label || ontology?.name) + ']'
  }

  static rolesInfo = ({ ontology, ontologies }) => {
    return Object.entries(ontology.roles).map(role => {

      return this.dependenciesForRole({ role: role, ontologies: ontologies })
    })
  }

  static dependencyInfo = ({ dependency, ontologies }) => {
    return Object.entries(dependency).map(([dependencyName, dependencyIds]) => {
      return (<div>
        {dependencyName + ': '}
        {dependencyIds.map(dependencyId => this.infoLabelForId({ ontologyId: dependencyId, ontologies: ontologies })).join(', ')}
      </div>)
    })
  }


  static dependenciesForRole = ({ role, ontologies }) => {
    let [roleName, dependencies] = role

    return dependencies.map((dependency) => {
      return (<div className='border'>
        {'=' + roleName}
        {this.dependencyInfo({ dependency: dependency, ontologies: ontologies })}
      </div>
      )
    })
    // })
    // })
  }

  static enrichedOntologyOption = (ont) => {
    return {
      value: ont.ontology_id,
      label: '[' + ont.ontology_id + '] ' + (ont.label || ont.name || "No label")
    }
  }

}
