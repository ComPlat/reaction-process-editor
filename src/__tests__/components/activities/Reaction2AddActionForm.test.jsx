import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  actionModes,
  fillIfPresent,
  renderActionFormForMode,
  runActionFormSpecs,
  selectFixtureSample,
} from "../../../testSupport/reaction2ActionFormSpecSupport";
import { reaction2Process } from "../../../testSupport/reaction2TestHelpers";

const sample = reaction2Process.select_options.materials.SAMPLE[0];

runActionFormSpecs({
  activityName: "ADD",
  fillHappyPath: () => {
    selectFixtureSample();
    fillIfPresent.metric("Target amount", 4.5);
    fillIfPresent.metric("TEMPERATURE", 31);
  },
  expectedWorkup: () => ({
    sample_id: sample.value,
    sample_name: sample.label,
  }),
});

describe("reaction 2 ADD material selection", () => {
  const selectors = ["sample_id", "SOLVENT_id", "MEDIUM_id", "ADDITIVE_id"];

  test("groups Molecular Entity with the alternative material selectors", () => {
    renderActionFormForMode({ activityName: "ADD", automationMode: actionModes[1].value });

    const molecularEntitySelect = screen.getByLabelText("Molecular Entity");
    const sourceSection = screen.getByLabelText("sample_id").closest(".form-section");
    expect(sourceSection).toContainElement(molecularEntitySelect);

    const option = Array.from(molecularEntitySelect.options).find(({ value }) => value);
    userEvent.selectOptions(molecularEntitySelect, option.value);

    selectors.forEach((selector) => {
      expect(screen.queryByLabelText(selector)).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText("Molecular Entity")).toBeInTheDocument();
  });

  test.each(selectors)("keeps only the %s selector visible until it is cleared", (selectedSelector) => {
    renderActionFormForMode({ activityName: "ADD", automationMode: actionModes[1].value });

    selectors.forEach((selector) => {
      expect(screen.getByLabelText(selector)).toBeInTheDocument();
    });

    const select = screen.getByLabelText(selectedSelector);
    const option = Array.from(select.options).find(({ value }) => value);
    userEvent.selectOptions(select, option.value);

    expect(screen.getByLabelText(selectedSelector)).toBeInTheDocument();
    expect(screen.queryByLabelText("Molecular Entity")).not.toBeInTheDocument();
    selectors
      .filter((selector) => selector !== selectedSelector)
      .forEach((selector) => {
        expect(screen.queryByLabelText(selector)).not.toBeInTheDocument();
      });

    userEvent.selectOptions(screen.getByLabelText(selectedSelector), "");

    selectors.forEach((selector) => {
      expect(screen.getByLabelText(selector)).toBeInTheDocument();
    });
  });
});
