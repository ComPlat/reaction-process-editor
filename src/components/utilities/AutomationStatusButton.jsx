import React from "react";
import { Button, UncontrolledTooltip } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AutomationStatusButton = ({ onChange, automationStatus, modelId }) => {

  const handleChangeAutomationStatus = () => {
    onChange(automationStatus.next)
  }

  return (
    <>
      <div id={"automation_status_" + modelId}>
        <Button
          onClick={handleChangeAutomationStatus}
          color={automationStatus.color}
        >
          <FontAwesomeIcon icon={automationStatus.icon} swapOpacity />
        </Button>
      </div>
      <UncontrolledTooltip target={"automation_status_" + modelId} >
        {automationStatus.tooltip}
      </UncontrolledTooltip>
    </>
  );
};

export default AutomationStatusButton;
