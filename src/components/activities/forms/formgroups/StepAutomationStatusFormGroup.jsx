import React from "react";
import { Label } from "reactstrap";

import StepAutomationStatusButton from "../../../utilities/StepAutomationStatusButton";
import StepAutomationStatusDecorator from "../../../../decorators/StepAutomationStatusDecorator";

const StepAutomationStatusFormGroup = ({ onChange, status, modelId }) => {

  return (
    <div className="d-flex justify-content-between align-self-center">
      <Label className={"col-form-label"}>
        {"Automation"}
      </Label>
      <Label className={"col-form-label"}>
        {StepAutomationStatusDecorator.labelForStatus(status)}
      </Label>
      <StepAutomationStatusButton
        modelId={modelId}
        onChange={onChange}
        status={status}
      />
    </div >
  )
};

export default StepAutomationStatusFormGroup;
