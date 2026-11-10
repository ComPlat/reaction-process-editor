import React from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AutomationControlDecorator from "../../decorators/AutomationControlDecorator";

const AutomationStatusButton = ({ onChange, automationStatus }) => {

  const handleChangeAutomationStatus = () => {
    onChange(AutomationControlDecorator.nextAutomationStatus(automationStatus))
  }

  return (
      <div>
        <Button
          title={automationStatus.tooltip}
          onClick={handleChangeAutomationStatus}
          color={automationStatus.color}
        >
          <FontAwesomeIcon icon={automationStatus.icon} swapOpacity />
        </Button>
      </div>
  );
};

export default AutomationStatusButton;
