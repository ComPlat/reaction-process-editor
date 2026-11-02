import {
  fillIfPresent,
  runActionFormSpecs,
  selectFixtureMolecularEntity,
} from "../../../testSupport/reaction2ActionFormSpecSupport";

runActionFormSpecs({
  activityName: "ANALYSIS_SPECTROSCOPY",
  fillHappyPath: () => {
    selectFixtureMolecularEntity(1);
    fillIfPresent.select("type", "CHMO:0000591");
    fillIfPresent.select("subtype", "CHMO:0000591");
  },
});
