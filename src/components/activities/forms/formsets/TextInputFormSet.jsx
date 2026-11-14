import React, { useState } from "react";
import { Input } from "reactstrap";

import OptionalFormSet from "./OptionalFormSet";

const TextInputFormSet = ({ label, value, onSave, disabled, typeColor }) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleSaveValue = () => onSave(currentValue)

  const handleCancelValue = () => setCurrentValue(value)

  return (
    <OptionalFormSet
      key={value}
      subFormLabel={label}
      valueSummary={value}
      onSave={handleSaveValue}
      onCancel={handleCancelValue}
      typeColor={typeColor}
      disabled={disabled}
    >
      <Input
        type="textarea"
        name="value"
        aria-label={label}
        value={currentValue}
        onChange={(event) => setCurrentValue(event.target.value)}
      />
    </OptionalFormSet>
  );
};

export default TextInputFormSet;
