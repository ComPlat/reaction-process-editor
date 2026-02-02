import React from "react";
import { Button, UncontrolledTooltip } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AutomationControlDecorator from "../../decorators/AutomationControlDecorator";

const AutomationStatusButton = ({ onChange, automationStatus }) => {

  const handleChangeAutomationStatus = () => {
    onChange(AutomationControlDecorator.nextAutomationStatus(automationStatus))
  }

  const id = Math.floor(Math.random() * 100000)

  console.log("automationStatus")
  console.log(automationStatus)

  return (
    <>
      <div id={"automation_status_" + automationStatus.value}>
        <Button
          onClick={handleChangeAutomationStatus}
          color={automationStatus.color}
        >
          <FontAwesomeIcon icon={automationStatus.icon} swapOpacity />
        </Button>
      </div>
      <UncontrolledTooltip target={"automation_status_" + automationStatus.value}>
        {automationStatus.tooltip}
      </UncontrolledTooltip >
    </>
  );
};

export default AutomationStatusButton;
