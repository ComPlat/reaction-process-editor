import React from "react";
import { Label } from "reactstrap";

import AutomationStatusButton from "../../../utilities/AutomationStatusButton";
import AutomationStatusDecorator from "../../../../decorators/AutomationStatusDecorator";

const StepAutomationStatusFormGroup = ({ onChange, status, modelId }) => {

  const currentAutomationStatus = AutomationStatusDecorator.stepAutomationStatus(status)

  return (
    <div className="d-flex justify-content-between align-self-center">
      <Label className={"col-form-label"}>
        {"Automation"}
      </Label>
      <Label className={"col-form-label"}>
        {currentAutomationStatus.label}
      </Label>
      <AutomationStatusButton
        modelId={modelId}
        onChange={onChange}
        automationStatus={currentAutomationStatus}
      />
    </div >
  )
};

export default StepAutomationStatusFormGroup;
