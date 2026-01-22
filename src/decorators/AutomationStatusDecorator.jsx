export default class AutomationStatusDecorator {

  static automationStatus = (status) =>
    this.automation_status[status] || this.automation_status["RUN"]

  static stepAutomationStatus = (status) =>
    this.step_automation_status[status] || this.step_automation_status["STEP_CAN_RUN"]

  static automation_status = {
    "RUN": {
      next: "HALT",
      label: "Can Run",
      tooltip: "This Action can run.",
      color: 'info',
      icon: "circle-play"
    },
    "HALT": {
      next: "AUTOMATION_RESPONDED",
      label: 'Halts Automation',
      tooltip: "This Action halts the automation to wait for an API response from the automation lab.",
      color: "danger",
      icon: "pause",
    },
    "AUTOMATION_RESPONDED": {
      next: "HALT_RESOLVED_NEEDS_CONFIRMATION",
      label: 'Response Received',
      tooltip: "This Action has received the required API response with intermediate results of the automation. The response needs manual processing.",
      color: "preparation",
      icon: "share-from-square",
      needsManualResolve: true,
    },
    "HALT_RESOLVED_NEEDS_CONFIRMATION": {
      next: "HALT_RESOLVED",
      label: 'Resolve Needs Confirmation',
      tooltip: "The automation response has been processed manually but can still be changed. Please confirm the Resolve manually to allow proceesing with the automation.  ",
      color: "warning",
      icon: "thumbs-up",
      needsManualResolve: true,
    },
    "HALT_RESOLVED": {
      next: "DEPENDS_ON_ACTIVITY",
      label: 'Halt Resolved',
      tooltip: "The automation response has been processed and confirmed manually. This Action can run.",
      color: "warning",
      icon: "share",
      needsManualResolve: true,
    },
    "DEPENDS_ON_ACTIVITY": {
      next: "DEPENDS_ON_STEP",
      label: 'Depends On Activity',
      tooltip: "This Action depends on the completion of a previous Action.",
      color: "warning",
      icon: "hand",
      dependsOnActivity: true,
    },
    "DEPENDS_ON_STEP": {
      next: "COMPLETED",
      label: 'Depends On Step',
      tooltip: "This Action depends on the completion of the previous Step.",
      color: "warning",
      icon: "pause",
      dependsOnActivity: true,
      dependsOnStep: true,
    },
    "COMPLETED": {
      next: "RUN",
      label: 'Completed',
      tooltip: "This Action has completed succesfully.",
      color: "success",
      icon: "check",
    },
  }

  static step_automation_status = {
    "STEP_CAN_RUN": {
      next: "STEP_DEPENDS_ON_PRECEDING",
      label: "Step Can Run",
      tooltip: "This Step can run.",
      color: 'info',
      icon: "circle-play"
    },
    "STEP_DEPENDS_ON_PRECEDING": {
      next: "STEP_MANUAL_PROCEED",
      label: "Depends On Previous Step",
      tooltip: "This Step can run only after the previous Step has completed.",
      color: 'warning',
      icon: "hand"
    },
    "STEP_MANUAL_PROCEED": {
      next: "STEP_COMPLETED",
      label: "Manually Can Run",
      tooltip: "This Step is manually set to proceed regardless of earlier steps and their completion status.",
      color: 'step',
      icon: "hand-point-right"
    },
    "STEP_COMPLETED": {
      next: "STEP_CAN_RUN",
      label: "Completed",
      tooltip: "This Step has completed succesfully.",
      color: 'success',
      icon: "circle-play"
    },
  }
}
