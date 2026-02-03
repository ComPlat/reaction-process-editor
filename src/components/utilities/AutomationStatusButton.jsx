import React, { useState } from "react";
import { Button, UncontrolledTooltip } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AutomationControlDecorator from "../../decorators/AutomationControlDecorator";

const AutomationStatusButton = ({ onChange, automationStatus }) => {

  const handleChangeAutomationStatus = () => {
    onChange(AutomationControlDecorator.nextAutomationStatus(automationStatus))
  }

  const [tooltipId] = useState(Math.floor(Math.random() * 1000000))

  return (
    <>
      <div id={"automation_status_" + tooltipId}>
        <Button
          onClick={handleChangeAutomationStatus}
          color={automationStatus.color}
        >
          <FontAwesomeIcon icon={automationStatus.icon} swapOpacity />
        </Button>
      </div>
      <UncontrolledTooltip target={"automation_status_" + tooltipId}>
        {automationStatus.tooltip}
      </UncontrolledTooltip >
    </>
  );
};

export default AutomationStatusButton;
