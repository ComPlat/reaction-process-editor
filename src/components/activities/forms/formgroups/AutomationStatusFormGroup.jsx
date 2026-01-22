import React from "react";
import { FormGroup, Label } from "reactstrap";

import AutomationStatusButton from "../../../utilities/AutomationStatusButton";
import ChromatographyPoolingFormModal from "../../../utilities/ChromatographyPoolingFormModal";

import AutomationStatusDecorator from "../../../../decorators/AutomationStatusDecorator";

const AutomationStatusFormGroup = ({ onChange, onResolvePooling, modelId, activity }) => {

  const currentAutomationStatus = AutomationStatusDecorator.automationStatus(activity.workup?.AUTOMATION_STATUS)

  return (
    <FormGroup className={"form-section"}>
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
      {activity && currentAutomationStatus.needsManualResolve &&
        <ChromatographyPoolingFormModal
          activity={activity}
          onResolvePooling={onResolvePooling}
        />
      }
    </FormGroup>
  )
};

export default AutomationStatusFormGroup;
