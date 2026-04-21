import React, { useState } from "react";

import ButtonGroupToggle from "../formgroups/ButtonGroupToggle";
import OptionalFormSet from "./OptionalFormSet";

import { OntologyConstants } from "../../../../constants/OntologyConstants";
import OptionsDecorator from "../../../../decorators/OptionsDecorator";

const AutomationModeFormSet = ({ label, value, onSave, disabled, typeColor }) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleSaveValue = () => onSave(currentValue)

  const handleCancelValue = () => setCurrentValue(value)

  const valueSummary = OptionsDecorator.valueToLabel(value, OntologyConstants.automationModeOptions)

  return (
    <OptionalFormSet
      key={value}
      subFormLabel={label}
      valueSummary={valueSummary}
      onSave={handleSaveValue}
      onCancel={handleCancelValue}
      typeColor={typeColor}
      disabled={disabled}
    >
      <ButtonGroupToggle
        value={currentValue}
        options={OntologyConstants.automationModeOptions}
        onChange={setCurrentValue} />
    </OptionalFormSet>
  );
};

export default AutomationModeFormSet;
