import OntologyRichLabel from "../components/ontologies/OntologyRichLabel"

import StringDecorator from "./StringDecorator"

export default class OntologiesInfoDecorator {

  static id = (ontology) => ontology?.ontology_id
  static label = (ontology) => ontology?.label
  static name = (ontology) => ontology?.name
  static link = (ontology) => ontology?.link

  static rolesInfo = ({ ontology, ontologies }) => {
    return Object.entries(ontology.roles).map(role => {
      return(this.dependenciesForRole({ role: role, ontologies: ontologies }))
    })
  }

  static dependencyInfo = ({ dependency, ontologies }) => {
    return Object.entries(dependency).map(([dependencyName, dependencyIds]) => {
      return (
        <div>
          <b>
            {StringDecorator.toLabelSpelling(dependencyName) + ': '}
          </b>
          {dependencyIds.map(dependencyId =>
            <OntologyRichLabel ontologyId={dependencyId} />)}
        </div>)
    })
  }

  static dependenciesForRole = ({ role, ontologies }) => {
    let [roleName, dependencies] = role

    return dependencies.map((dependency) => {
      return (<>
        <div className='row border-bottom'>
          <b>
            {'=' + StringDecorator.toLabelSpelling(roleName)}
          </b>
          <div>
            {this.dependencyInfo({ dependency: dependency, ontologies: ontologies })}
          </div>
        </div>
      </>
      )
    })
  }

  static richLabel = (ont) => { return '[' + ont?.ontology_id + '] ' + (ont?.label || ont?.name || 'No label') }

  static richLabelOption = (ont) => {
    return {
      value: ont.ontology_id,
      label: this.richLabel(ont)
    }
  }

}
