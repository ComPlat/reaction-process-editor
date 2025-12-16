export default class StepAutomationStatusDecorator {
  static nextAutomationStatus = (currentValue) => {
    return ({
      "STEP_CAN_RUN": "STEP_CAN_RUN",
      "STEP_COMPLETED": "STEP_COMPLETED",
      "STEP_HALT_BY_PRECEDING": "STEP_MANUAL_PROCEED",
      "STEP_MANUAL_PROCEED": "STEP_HALT_BY_PRECEDING",
    }[currentValue] || "STEP_CAN_RUN")
  }

  static labelForStatus = (currentStatus) => {
    return ({
      "STEP_CAN_RUN": "Step Can Run",
      "STEP_COMPLETED": "Step Completed",
      "STEP_HALT_BY_PRECEDING": "Step halted by Preceding",
      "STEP_MANUAL_PROCEED": "Manual Proceed"
    }[currentStatus] || "step can run")
  }

  static tooltipForStatus = (currentStatus) => {
    return ({
      "STEP_CAN_RUN": "This step can run.",
      "STEP_COMPLETED": "This step has run successfully.",
      "STEP_HALT_BY_PRECEDING": "This step can not run because a previous step has an action requiring automation HALT (and subsequent human intervention).",
      "STEP_MANUAL_PROCEED": "This step is manually set to proceed despite of an earlier step with an automation HALT."
    }[currentStatus] || "step can run")
  }

  static iconForStatus = (currentStatus) => {
    return ({
      "STEP_CAN_RUN": "circle-play",
      "STEP_COMPLETED": "check",
      "STEP_HALT_BY_PRECEDING": "hand",
      "STEP_MANUAL_PROCEED": "hand-point-right"
    }[currentStatus] || "circle-play")
  }

  static colorForStatus = (currentStatus) => {
    return ({
      "STEP_CAN_RUN": "info",
      "STEP_COMPLETED": "success",
      "STEP_HALT_BY_PRECEDING": "warning",
      "STEP_MANUAL_PROCEED": "step"
    }[currentStatus] || "")
  }
}
