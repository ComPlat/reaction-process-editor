import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const TooltipButton = ({ tooltip, color, size, className }) => {
  return (
    <span title={tooltip} className={className}>
      <FontAwesomeIcon
        icon={faInfoCircle}
        size={size || "sm"}
        className={`ms-2 mt-1 text-${color || 'danger'}`}
        href="#"
      />
    </span>
  );
};

export default TooltipButton;
