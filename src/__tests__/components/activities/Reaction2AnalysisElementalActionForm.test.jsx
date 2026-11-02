import {
  fillIfPresent,
  runActionFormSpecs,
  selectFixtureMolecularEntity,
} from "../../../testSupport/reaction2ActionFormSpecSupport";

runActionFormSpecs({
  activityName: "ANALYSIS_ELEMENTAL",
  fillHappyPath: () => {
    selectFixtureMolecularEntity(1);
    fillIfPresent.select("device", "CHMO:0001075");
  },
});
