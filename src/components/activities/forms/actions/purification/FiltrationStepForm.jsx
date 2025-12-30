import React, { useContext, useState } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DurationSelection from "../../formgroups/DurationSelection";
import MetricsInputFormGroup from "../../formgroups/MetricsInputFormGroup";
import OptionalFormSet from "../../formsets/OptionalFormSet";
import SolventListFormGroup from "../../formgroups/SolventListFormGroup";

import PurificationDecorator from "../../../../../decorators/PurificationDecorator";

import { SelectOptions } from "../../../../../contexts/SelectOptions";
import { SubFormController } from "../../../../../contexts/SubFormController";

const FiltrationStepForm = ({
  label,
  workup,
  onSave,
  onCancel,
  onDelete,
  canDelete,
  initialShowForm
}) => {
  const subFormController = useContext(SubFormController);
  const selectOptions = useContext(SelectOptions);
  const solventOptions = selectOptions.FORMS.FILTRATION.solvents;

  const initialFormData = {
    duration: workup.duration || 0,
    solvents: workup.solvents || [],
    amount: workup.amount || { value: 0, unit: "ml" },
    rinse_vessel: workup.rinse_vessel || false,
    repetitions: workup.repetitions || { value: 1, unit: "TIMES" }
  }

  const [formData, setFormData] = useState(initialFormData);

  const resetForm = () => setFormData(initialFormData)

  const handleChangeFormData = (key) => (value) => {
    setFormData((prevData) => {
      return { ...prevData, [key]: value }
    })
  }

  const handleRinseCheckBox = (event) => {
    console.log(event)
    handleChangeFormData('rinse_vessel')(event.target.checked)
  }

  const handleCancel = () => {
    onCancel()
    resetForm()
  }
  const handleSave = () => {
    onSave(formData)
  }

  const handleDelete = () => {
    subFormController.toggleSubForm(label);
    onDelete();
  };

  const summary = PurificationDecorator.purificationStepInfo(formData, solventOptions)

  return (
    <OptionalFormSet
      subFormLabel={label}
      valueSummary={summary}
      onSave={handleSave}
      onCancel={handleCancel}
      typeColor="action"
      initialShowForm={initialShowForm}
    >
      {canDelete && (
        <OptionalFormSet.ExtraButton>
          <Button color="danger" onClick={handleDelete}>
            <FontAwesomeIcon icon="trash" />
          </Button>
        </OptionalFormSet.ExtraButton>
      )}
      <SolventListFormGroup
        solvents={formData.solvents}
        solventOptions={solventOptions}
        setSolvents={handleChangeFormData('solvents')}
      />
      <FormGroup>
        <MetricsInputFormGroup
          tooltipName={'purification_amount'}
          metricName={"VOLUME"}
          amount={formData.amount}
          onChange={handleChangeFormData('amount')}
        />
        <MetricsInputFormGroup
          metricName={"REPETITIONS"}
          amount={formData.repetitions}
          onChange={handleChangeFormData('repetitions')}
        />
        <DurationSelection
          tooltipName={'purification_duration'}
          duration={formData.duration}
          onChangeDuration={handleChangeFormData('duration')}
        />
        <FormGroup check className="mb-3">
          <Label check>
            <Input
              type="checkbox"
              checked={formData.rinse_vessel}
              onChange={handleRinseCheckBox}
            />
            Rinse Vessel
          </Label>
        </FormGroup>
      </FormGroup>
    </OptionalFormSet>
  );
};

export default FiltrationStepForm;
