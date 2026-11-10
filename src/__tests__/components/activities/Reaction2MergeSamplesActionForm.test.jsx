import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import {
  runActionFormSpecs,
} from "../../../testSupport/reaction2ActionFormSpecSupport";
import {
  fixtureVessel,
  reaction2Process,
} from "../../../testSupport/reaction2TestHelpers";

runActionFormSpecs({
  activityName: "MERGE_SAMPLES",
  vessels: [fixtureVessel],
  fillHappyPath: () => {
    userEvent.click(screen.getByRole("button", { name: fixtureVessel.label }));
  },
  expectedWorkup: () => ({}),
  expectedActivity: () => ({
    reaction_process_vessel: expect.objectContaining({
      id: fixtureVessel.id,
      vesselable_type: fixtureVessel.vesselable_type,
    }),
  }),
});
