import React from "react";
import { Button, UncontrolledTooltip } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import StepAutomationStatusDecorator from "../../decorators/StepAutomationStatusDecorator";

const StepAutomationStatusButton = ({ onChange, status, modelId }) => {

  const handleChangeAutomationStatus = () => {
    onChange(
      StepAutomationStatusDecorator.nextAutomationStatus(status)
    )
  }

  return (
    <>
      <div id={"step_automation_status_" + modelId}>
        <Button
          onClick={handleChangeAutomationStatus}
          color={StepAutomationStatusDecorator.colorForStatus(status)}
        >
          <FontAwesomeIcon icon={StepAutomationStatusDecorator.iconForStatus(status)} swapOpacity />
        </Button>
      </div>
      <UncontrolledTooltip target={"step_automation_status_" + modelId} >
        {StepAutomationStatusDecorator.tooltipForStatus(status)}
      </UncontrolledTooltip>
    </>
  );
};

export default StepAutomationStatusButton;
