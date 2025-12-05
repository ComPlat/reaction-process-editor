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
    label: 'Remove / Exchange',
    actions: [
      {
        id: 'remove_exchange_sample',
        createLabel: 'Remove',
        activity: {
          activity_name: 'REMOVE',
          workup: { origin_type: 'FROM_REACTION', automation_mode: ontologyAutomated, }
        }
      },
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
          activity_name: 'ANALYSIS',
          workup: {
            analysis_type: 'CHROMATOGRAPHY',
            automation_mode: ontologyAutomated,
            AUTOMATION_STATUS: 'HALT',
          }
        }
      },
      {
        id: 'analysis_spectroscopy',
        createLabel: 'Spectroscopy',
        activity: {
          activity_name: 'ANALYSIS',
          workup: {
            automation_mode: ontologyAutomated,
            analysis_type: 'SPECTROSCOPY'
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
          activity_name: 'PURIFICATION',
          workup: {
            purification_type: 'FILTRATION',
            automation_mode: ontologyAutomated,
            filtration_mode: 'KEEP_PRECIPITATE'
          }
        }
      },
      {
        id: 'extraction',
        createLabel: 'Extraction',
        activity: {
          activity_name: 'PURIFICATION',
          workup: {
            purification_type: 'EXTRACTION',
            automation_mode: ontologyAutomated,
            phase: 'ORGANIC'
          }
        }
      },
      {
        id: 'chromatography',
        createLabel: 'Chromatography',
        activity: {
          activity_name: 'PURIFICATION',
          workup: {
            purification_type: 'CHROMATOGRAPHY', // supportive? soon unused?
            automation_mode: ontologyAutomated,
            AUTOMATION_STATUS: 'HALT',
          }
        }
      },
      {
        id: 'crystallization',
        createLabel: 'Crystallization',
        activity: {
          activity_name: 'PURIFICATION',
          workup: {
            purification_type: 'CRYSTALLIZATION',
            automation_mode: ontologyAutomated,
          }
        }
      },
      {
        id: 'centrifugation',
        createLabel: 'Centrifugation',
        activity: {
          activity_name: 'PURIFICATION',
          workup: {
            purification_type: 'CENTRIFUGATION',
            automation_mode: ontologyAutomated,
          }
        }
      },
    ]
  },

]]
