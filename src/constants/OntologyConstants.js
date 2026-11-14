import StringDecorator from "../decorators/StringDecorator";

export const OntologyConstants = {
  detector_ontology_id: {
    PDA: "CHMO:0001728",
    ELSD: "CHMO:0002866",
    MS: "CHMO:0002337",
  },

  class_ontology_id: {
    // Naming "class" from ELN convention
    ADD: "OBI:0000274",
    TRANSFER: "OBI:0000383",
    CENTRIFUGATION: "OBI:0302886",
    CHROMATOGRAPHY: "CHMO:0001000",
    CRYSTALLISATION: "CHMO:0001477",
    EXTRACTION: "CHMO:0001577",
    FILTRATION: "CHMO:0001640",
    MERGE_SAMPLES: "OBI:0000652",
    MIXING: "CHMO:0001685",
    ANALYSIS_CHROMATOGRAPHY: "CHMO:0001000",
    ANALYSIS_ELEMENTAL: "CHMO:0001075",
    ANALYSIS_SPECTROSCOPY: "CHMO:0000228",
    EVAPORATION: "CHMO:0001574",
    GAS_EXCHANGE: "NCIT:C171981",
  },
  action_ontology_id: {
    // Naming "action" from ELN convention
    ADD: "CPOKIT:0000006", // Dosing
    TRANSFER: "CPOKIT:0000006", // Dosing
    CENTRIFUGATION: "CHMO:0002231", // Purification/Separation
    CHROMATOGRAPHY: "CHMO:0002231", // Purification/Separation
    CRYSTALLISATION: "CHMO:0002231", // Purification/Separation
    EXTRACTION: "CHMO:0002231", // Purification/Separation
    FILTRATION: "CHMO:0002231", // Purification/Separation
    MERGE_SAMPLES: "CPOKIT:0000006", // Dosing
    MIXING: "OBI:0000652", // material combination
    ANALYSIS_CHROMATOGRAPHY: "OBI:0000070", // Assay/Analysis
    ANALYSIS_ELEMENTAL: "OBI:0000070", // Assay/Analysis
    ANALYSIS_SPECTROSCOPY: "OBI:0000070", // Assay/Analysis
    EVAPORATION: "CPOKIT:0000008", // Exchange & Remove
    GAS_EXCHANGE: "CPOKIT:0000008", // Exchange & Remove
  },

  automation_mode: {
    manual: "NCIT:C63513",
    semiAutomated: "NCIT:C172484",
    automated: "NCIT:C70669",
  },

  isAutomated: (status) =>
    status === OntologyConstants.automation_mode.automated,
  isSemiAutomated: (status) =>
    status === OntologyConstants.automation_mode.semiAutomated,
  isManual: (status) => status === OntologyConstants.automation_mode.manual,

  ontologyTypes: [
    "TERMINOLOGY",
    "CUSTOM_TERMINOLOGY",
    "DEVICE_TYPE",
    "DEVICE_CONFIG",
  ],
  ontologyTypeOptions: [
    "TERMINOLOGY",
    "CUSTOM_TERMINOLOGY",
    "DEVICE_TYPE",
    "DEVICE_CONFIG",
  ].map((ont) => {
    return { value: ont, label: StringDecorator.toLabelSpelling(ont) };
  }),

  roleTypeOptions: [
    "action",
    "class",
    "type",
    "subtype",
    "detector",
    "condition",
    "device",
    "solvent",
    "mobile_phase",
    "material",
  ].map((i) => {
    return { value: i, label: StringDecorator.toLabelSpelling(i) };
  }),

  isDevice: (type) => ["DEVICE_TYPE", "DEVICE_CONFIG"].includes(type),
};
