import React, { useContext } from "react";
import { FormGroup, Label } from "reactstrap";

import Select from "react-select";

import AutomationStatusButton from "../../../utilities/AutomationStatusButton";

import { SelectOptions } from '../../../../contexts/SelectOptions';

import OptionsDecorator from "../../../../decorators/OptionsDecorator";
import AutomationControlDecorator from "../../../../decorators/AutomationControlDecorator";


const AutomationControlFormGroup = ({ automationControl, onChange }) => {

  automationControl ||= {}
  const stepOptions = useContext(SelectOptions).FORMS.TRANSFER
  const dependsOnActivityOptions = useContext(SelectOptions).automation_control.activities
  const dependsOnStepOptions = stepOptions.targets

  const stepDependencyId = OptionsDecorator.optionForValue(automationControl.depends_on_step_id, stepOptions.targets)
  const activityDependencyId = OptionsDecorator.optionForValue(automationControl.depends_on_action_id, dependsOnActivityOptions)

  const automationStatus = AutomationControlDecorator.automationStatusByName(automationControl.status) ||
    AutomationControlDecorator.defaultStepAutomationStatus

  const handleChange = (key) => (value) => {
    let newAutomationControl = {
      ...automationControl,
      [key]: value
    }
    onChange(newAutomationControl)
  }

  const handleStatusChange = (newStatus) => {
    onChange({ status: newStatus.value })
  }

  return (

    <>
      <FormGroup className={"form-section"}>
        <div className="d-flex justify-content-between align-self-center">
          <Label className={"col-form-label"}>
            {"Automation: "}
          </Label>
          <Label className={"col-form-label"}>
            {automationStatus?.label}
          </Label>
          <AutomationStatusButton
            onChange={handleStatusChange}
            automationStatus={automationStatus}
          />
        </div >
        {automationStatus?.dependsOnActivity &&
          <div className="pt-3">
            < Select
              className="react-select--overwrite"
              classNamePrefix="react-select"
              name="depends_on_action_id"
              options={dependsOnActivityOptions}
              value={activityDependencyId}
              onChange={selected => handleChange('depends_on_action_id')(selected?.value)}
              isClearable
            />
          </div>
        }
        {
          automationStatus?.dependsOnStep &&
          <div className="pt-3">
            <Select
              className="react-select--overwrite"
              classNamePrefix="react-select"
              name="depends_on_step_id"
              options={dependsOnStepOptions}
              value={stepDependencyId}
              onChange={selected => handleChange('depends_on_step_id')(selected?.value)}
              isClearable
            />
          </div>
        }
      </FormGroup>
    </>
  )
};

export default AutomationControlFormGroup;
