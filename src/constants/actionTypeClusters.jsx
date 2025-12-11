import { ontologyId } from "./ontologyId"


let ontologyAutomated = ontologyId.automation_modes.automated

export const actionTypeClusters = [[
  {
    id: 'add',
    label: 'Dosing',
    actions: [
      {
        id: 'add_material',
        createLabel: 'Add',
        activity: {
          activity_name: "ADD",
          workup: { automation_mode: ontologyAutomated, }
        }
      },
      {
        id: 'add_transfer',
        createLabel: 'Transfer',
        activity: {
          activity_name: 'TRANSFER',
          workup: { automation_mode: ontologyAutomated, }
        }
      },
    ]
  },

  {
    id: 'remove_exchange',
    label: 'Exchange / Remove',
    actions: [
      {
        id: 'remove_exchange_sample',
        createLabel: 'Evaporate',
        activity: {
          activity_name: 'EVAPORATION',
          workup: { origin_type: 'FROM_REACTION', automation_mode: ontologyAutomated, }
        }
      },
      {
        id: 'remove_exchange_sample',
        createLabel: 'Gas Exchange',
        activity: {
          activity_name: 'GAS_EXCHANGE',
          workup: { automation_mode: ontologyAutomated, }
        }
      },
    ]
  },
  {
    id: 'combine',
    label: 'Combine',
    actions: [
      {
        id: 'mixing',
        createLabel: 'Mixing',
        activity: { activity_name: 'MIXING', workup: { automation_mode: ontologyAutomated, } }
      }
    ]
  },
  {
    id: 'time',
    label: 'Time',
    actions: [
      {
        id: 'time_wait',
        createLabel: 'Wait',
        activity: { activity_name: 'WAIT', workup: { automation_mode: ontologyAutomated, } }
      }
    ]
  },
  {
    id: 'intermediate',
    label: 'Save Sample',
    actions: [
      {
        id: 'intermediate_save',
        createLabel: 'Intermediate',
        activity: {
          activity_name: 'SAVE',
          workup: {
            automation_mode: ontologyAutomated,
            intermediate_type: 'CRUDE',
            target_amount: { unit: 'ml' },
            purity: { value: 1, unit: 'PURITY' }
          }
        }
      }
    ]
  },
],
[
  // column 2
  {
    id: 'analysis',
    label: 'Analysis',
    actions: [
      {
        id: 'analysis_chromatography',
        createLabel: 'Chromatography',
        activity: {
          activity_name: 'ANALYSIS_CHROMATOGRAPHY',
          workup: {
            automation_mode: ontologyAutomated,
            AUTOMATION_STATUS: 'HALT',
          }
        }
      },
      {
        id: 'analysis_spectroscopy',
        createLabel: 'Spectroscopy',
        activity: {
          activity_name: 'ANALYSIS_SPECTROSCOPY',
          workup: {
            automation_mode: ontologyAutomated,
          }
        }
      },
    ]
  },

  {
    id: 'purification',
    label: 'Separate / Purify',
    actions: [
      {
        id: 'filtration',
        createLabel: 'Filtration',
        activity: {
          activity_name: 'FILTRATION',
          workup: {
            automation_mode: ontologyAutomated,
            filtration_mode: 'KEEP_PRECIPITATE'
          }
        }
      },
      {
        id: 'extraction',
        createLabel: 'Extraction',
        activity: {
          activity_name: 'EXTRACTION',
          workup: {
            automation_mode: ontologyAutomated,
            phase: 'ORGANIC'
          }
        }
      },
      {
        id: 'chromatography',
        createLabel: 'Chromatography',
        activity: {
          activity_name: 'CHROMATOGRAPHY',
          workup: {
            automation_mode: ontologyAutomated,
            AUTOMATION_STATUS: 'HALT',
          }
        }
      },
      {
        id: 'crystallization',
        createLabel: 'Crystallization',
        activity: {
          activity_name: 'CRYSTALLIZATION',
          workup: {
            automation_mode: ontologyAutomated,
          }
        }
      },
      {
        id: 'centrifugation',
        createLabel: 'Centrifugation',
        activity: {
          activity_name: 'CENTRIFUGATION',
          workup: {
            automation_mode: ontologyAutomated,
          }
        }
      },
    ]
  },

]]
