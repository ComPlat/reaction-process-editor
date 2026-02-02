export default class AutomationControlDecorator {
  static automation_status = {
    "CAN_RUN": {
      value: "CAN_RUN",
      next: "HALT",
      label: "Can Run",
      tooltip: "This Action can run.",
      color: 'info',
      icon: "circle-play"
    },
    "HALT": {
      value: "HALT",
      next: "AUTOMATION_RESPONDED",
      label: 'Halts Automation',
      tooltip: "This Action halts the automation to wait for an API response from the automation lab.",
      color: "danger",
      icon: "pause",
    },
    "AUTOMATION_RESPONDED": {
      value: "AUTOMATION_RESPONDED",
      next: "HALT_RESOLVED_NEEDS_CONFIRMATION",
      label: 'Response Received',
      tooltip: "This Action has received the required API response with intermediate results of the automation. The response needs manual processing.",
      color: "preparation",
      icon: "share-from-square",
      needsManualResolve: true,
    },
    "HALT_RESOLVED_NEEDS_CONFIRMATION": {
      value: "HALT_RESOLVED_NEEDS_CONFIRMATION",
      next: "HALT_RESOLVED",
      label: 'Resolve Needs Confirmation',
      tooltip: "The automation response has been processed manually but can still be changed. Please confirm the Resolve manually to allow proceesing with the automation.  ",
      color: "warning",
      icon: "thumbs-up",
      needsManualResolve: true,
    },
    "HALT_RESOLVED": {
      value: "HALT_RESOLVED",
      next: "DEPENDS_ON_ACTION",
      label: 'Halt Resolved',
      tooltip: "The automation response has been processed and confirmed manually. This Action can run.",
      color: "warning",
      icon: "share",
    },
    "DEPENDS_ON_ACTION": {
      value: "DEPENDS_ON_ACTION",
      next: "DEPENDS_ON_STEP",
      label: 'Depends On Activity',
      tooltip: "This Action depends on the completion of a previous Action.",
      color: "danger",
      icon: "hand",
      dependsOnActivity: true,
    },
    "DEPENDS_ON_STEP": {
      value: "DEPENDS_ON_STEP",
      next: "COMPLETED",
      label: 'Depends On Step',
      tooltip: "This Action depends on the completion of the previous Step.",
      color: "danger",
      icon: "hand",
      dependsOnStep: true,
    },
    "COMPLETED": {
      value: "COMPLETED",
      next: "CAN_RUN",
      label: 'Completed',
      tooltip: "This Action has completed succesfully.",
      color: "success",
      icon: "check",
    },
  }

  static step_automation_status = {
    "STEP_CAN_RUN": {
      value: "STEP_CAN_RUN",
      next: "STEP_DEPENDS_ON_PRECEDING",
      label: "Step Can Run",
      tooltip: "This Step can run.",
      color: 'info',
      icon: "circle-play"
    },
    "STEP_DEPENDS_ON_PRECEDING": {
      value: "STEP_DEPENDS_ON_PRECEDING",
      next: "STEP_COMPLETED",
      label: "Depends On Preceding Step",
      tooltip: "This Step can run only after a preceding Step has completed.",
      color: 'danger',
      icon: "hand",
      dependsOnStep: true,
    },
    "STEP_COMPLETED": {
      value: "STEP_COMPLETED",
      next: "STEP_CAN_RUN",
      label: "Completed",
      tooltip: "This Step has completed succesfully.",
      color: 'success',
      icon: "circle-play"
    },
  }

  static automationStatusByName = (name) => this.automation_status[name]
    || this.step_automation_status[name]

  static nextAutomationStatus = (status) => this.automation_status[status.next]
    || this.step_automation_status[status.next]

  static defaultAutomationStatus = this.automation_status['CAN_RUN']
  static defaultStepAutomationStatus = this.step_automation_status['STEP_CAN_RUN']

  static defaultAutomationControl = { status: this.defaultAutomationStatus }
  static defaultStepAutomationControl = { status: this.defaultStepAutomationStatus }

  static automationControlByStatusName = (name) => { return { status: this.automation_status[name] || this.step_automation_status[name] } }

  static automationControlForTransferFromStepId = (stepId) => {
    return {
      status: this.automation_status['DEPENDS_ON_STEP'],
      depends_on_step_id: stepId
    }
  }

  static automationControlForTransferFromSampleIdSampleId = (sampleId, activityOptions) => {
    return {
      status: this.automation_status['DEPENDS_ON_ACTION'],
      depends_on_action_id: activityOptions.find(activity => activity.saved_sample_id === sampleId)?.id,
    }
  }

}
