import { ontologyId } from "./ontologyId"

export const actionTypeClusters = [[
  {
    id: 'add',
    label: 'Add',
    actions: [
      {
        id: 'add_material',
        createLabel: 'Add',
        activity: {
          activity_name: "ADD",
          workup: { automation_mode: ontologyId.automation_modes.automated, }
        }
      },
      {
        id: 'add_transfer',
        createLabel: 'Transfer',
        activity: {
          activity_name: 'TRANSFER',
          workup: { automation_mode: ontologyId.automation_modes.automated, }
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
          workup: { origin_type: 'FROM_REACTION', automation_mode: ontologyId.automation_modes.automated, }
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
        activity: { activity_name: 'WAIT', workup: { automation_mode: ontologyId.automation_modes.automated, } }
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
            automation_mode: ontologyId.automation_modes.automated,
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
            analysis_type: 'CHROMATOGRAPHY', // soon unused
            action: ontologyId.action.analysis,
            class: ontologyId.class.chromatography,
            automation_mode: ontologyId.automation_modes.automated,
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
            action: ontologyId.action.analysis,
            class: ontologyId.class.spectroscopy,
            automation_mode: ontologyId.automation_modes.automated,
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
            automation_mode: ontologyId.automation_modes.automated,
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
            automation_mode: ontologyId.automation_modes.automated,
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
            action: ontologyId.action.purification,
            class: ontologyId.class.chromatography,
            automation_mode: ontologyId.automation_modes.automated,
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
            automation_mode: ontologyId.automation_modes.automated,
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
            automation_mode: ontologyId.automation_modes.automated,
          }
        }
      },
    ]
  },

]]
