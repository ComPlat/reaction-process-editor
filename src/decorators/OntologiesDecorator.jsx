export default class OntologiesDecorator {

  static labelForOntologyId = ({ ontologyId, ontologies }) =>
    this.findByOntologyId({ ontologyId: ontologyId, ontologies: ontologies })?.label

  static findByOntologyId = ({ ontologyId, ontologies }) =>
    ontologyId && ontologies?.find(option => ontologyId === option.ontology_id)

  static findAllByOntologyIds = ({ ontologyIds, ontologies }) =>
    ontologies.filter(option => ontologyIds?.includes(option.ontology_id))

  static createUnavailableOption = ({ ontologyId }) => ontologyId && { ontology_id: ontologyId, value: ontologyId, label: ontologyId, unavailable: true, roles: [] }

  static activeOptionsForRoleName = ({ roleName, options }) => {
    return options.filter((option) => {
      return option.active && option.roles[roleName]
    })
  }

  static filterDevicesByDetectors = ({ workup, ontologies }) => {
    let devices = this.activeOptionsForRoleName({ roleName: 'device', options: ontologies })

    if (workup.detector?.length) {
      devices = devices.filter(device =>
        workup.detector.every(detectorInWorkup =>
          !!device.detectors.find(detector =>
            detector.value === detectorInWorkup)))
    }
    return devices
  }

  static filterSubtypeByDetectors = ({ workup, ontologies }) => {
    let matchingDevices = this.filterDevicesByDetectors({ workup: workup, ontologies: ontologies })

    return ontologies
      .filter((option) => option.roles['subtype'])
      .filter(subtype => matchingDevices?.find((device) => {
        let roles = device.roles['device']
        return device.active && roles?.find(role => role['subtype']?.includes(subtype.value))
      }))
  }

  static activeOptionsForWorkupDependencies = ({ roleName, workup, ontologies }) => {
    if (roleName === 'subtype' && !!workup.detector) {
      ontologies = this.filterSubtypeByDetectors({ workup: workup, ontologies: ontologies })
    }

    let activeOptions = ontologies.filter((option) => {
      let roles = option.roles[roleName]

      return option.active && roles?.find(role => {
        return Object
          .entries(role)
          .every(([dependency_key, dependencies]) => dependencies.includes(workup[dependency_key]))
      })
    })

    return activeOptions
  }

  static selectableOptionsMatchingWorkupDependencies = ({ roleName, options, ontologies, workup }) => {
    options ||= ontologies
    let currentValue = workup[roleName]
    let activeDependencyOptions = this.activeOptionsForWorkupDependencies({ roleName: roleName, ontologies: options, workup: workup })

    if (currentValue && !this.findByOntologyId({ ontologyId: currentValue, ontologies: activeDependencyOptions })) {
      let missingCurrentOption =
        this.findByOntologyId({ ontologyId: currentValue, ontologies: ontologies })
        || this.createUnavailableOption({ ontologyId: currentValue })

      activeDependencyOptions.push({ ...missingCurrentOption, unmetDependency: true })
    }
    return activeDependencyOptions
  }

  static selectableMultiOptionsForWorkupDependencies = ({ roleName, ontologies, options, workup }) => {
    options ||= ontologies
    let currentValues = workup[roleName]
    let activeDependencyOptions = this.activeOptionsForWorkupDependencies({ roleName: roleName, ontologies: options, workup: workup })

    currentValues?.forEach(currentValue => {
      if (currentValue && !this.findByOntologyId({ ontologyId: currentValue, ontologies: activeDependencyOptions })) {
        let missingCurrentOption = this.findByOntologyId({ ontologyId: currentValue, ontologies: ontologies })
          || this.createUnavailableOption({ ontologyId: currentValue })

        activeDependencyOptions.push({ ...missingCurrentOption, unmetDependency: true })
      }
    }
    )
    return activeDependencyOptions
  }
}
