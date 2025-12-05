export default class OntologiesDecorator {

  static labelForONTOLOGIES = ({ ONTOLOGIES, ontologies }) =>
    this.findByONTOLOGIES({ ONTOLOGIES: ONTOLOGIES, ontologies: ontologies })?.label

  static findByONTOLOGIES = ({ ONTOLOGIES, ontologies }) =>
    ONTOLOGIES && ontologies?.find(option => ONTOLOGIES === option.ontology_id)

  static findAllByONTOLOGIESs = ({ ONTOLOGIESs, ontologies }) =>
    ontologies.filter(option => ONTOLOGIESs?.includes(option.ontology_id))

  static createUnavailableOption = ({ ONTOLOGIES }) => ONTOLOGIES && { ontology_id: ONTOLOGIES, value: ONTOLOGIES, label: ONTOLOGIES, unavailable: true, roles: [] }

  static activeOptionsForRoleName = ({ roleName, options }) => {
    return options.filter((option) => {
      return option.active && option.roles[roleName]
    })
  }

  static activeOptionsForWorkupDependencies = ({ roleName, workup, options }) => {
    return options.filter((option) => {
      let roles = option.roles[roleName]

      return option.active && roles?.find(role => {
        return Object
          .entries(role)
          .every(([dependency_key, dependencies]) => dependencies.includes(workup[dependency_key]))
      })
    })
  }

  static selectableOptionsMatchingWorkupDependencies = ({ roleName, options, ontologies, workup }) => {
    options ||= ontologies
    let currentValue = workup[roleName]
    let activeDependencyOptions = this.activeOptionsForWorkupDependencies({ roleName: roleName, options: options, workup: workup })

    if (currentValue && !this.findByONTOLOGIES({ ONTOLOGIES: currentValue, ontologies: activeDependencyOptions })) {
      let missingCurrentOption =
        this.findByONTOLOGIES({ ONTOLOGIES: currentValue, ontologies: ontologies })
        || this.createUnavailableOption({ ONTOLOGIES: currentValue })

      activeDependencyOptions.push({ ...missingCurrentOption, unmetDependency: true })
    }
    return activeDependencyOptions
  }

  static selectableMultiOptionsForWorkupDependencies = ({ roleName, ontologies, options, workup }) => {
    options ||= ontologies
    let currentValues = workup[roleName]
    let activeDependencyOptions = this.activeOptionsForWorkupDependencies({ roleName: roleName, options: options, workup: workup })

    currentValues?.forEach(currentValue => {
      if (currentValue && !this.findByONTOLOGIES({ ONTOLOGIES: currentValue, ontologies: activeDependencyOptions })) {
        let missingCurrentOption = this.findByONTOLOGIES({ ONTOLOGIES: currentValue, ontologies: ontologies })
          || this.createUnavailableOption({ ONTOLOGIES: currentValue })

        activeDependencyOptions.push({ ...missingCurrentOption, unmetDependency: true })
      }
    }
    )
    return activeDependencyOptions
  }
}
