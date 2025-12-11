import React, { useContext, useState } from "react";
import { Button, FormGroup, Label } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ButtonGroupToggle from "../../formgroups/ButtonGroupToggle";
import DurationSelection from "../../formgroups/DurationSelection";
import MetricsInputFormGroup from "../../formgroups/MetricsInputFormGroup";
import OptionalFormSet from "../../formsets/OptionalFormSet";
import SolventListFormGroup from "../../formgroups/SolventListFormGroup";

import PurificationDecorator from "../../../../../decorators/PurificationDecorator";

import { SelectOptions } from "../../../../../contexts/SelectOptions";
import { SubFormController } from "../../../../../contexts/SubFormController";

const AnalysisChromatographyStepForm = ({
  label,
  workup,
  solventOptions,
  onSave,
  onCancel,
  onDelete,
  canDelete,
  initialShowForm,
  disabled
}) => {
  const chromatographyOptions = useContext(SelectOptions).FORMS.ANALYSIS_CHROMATOGRAPHY;

  const subFormController = useContext(SubFormController);

  const initialFormData = {
    duration: workup.duration || 0,
    solvents: workup.solvents || [],
    amount: workup.amount || { value: 0, unit: "ml" },
    flow_rate: workup.flow_rate || { value: undefined, unit: "MLMIN" },
    step_mode: workup.step_mode || chromatographyOptions.step_modes[0].value,
    prod_mode: workup.prod_mode || chromatographyOptions.prod_modes[0].value
  }

  const [formData, setFormData] = useState(initialFormData);

  const resetForm = () => setFormData(initialFormData)

  const handleChangeFormData = (key) => (value) => {
    setFormData((prevData) => {
      return { ...prevData, [key]: value }
    })
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

  const summary = PurificationDecorator.infoLineSolventsWithRatio(formData)

  return (
    <>
      <OptionalFormSet
        subFormLabel={label}
        valueSummary={summary}
        onSave={handleSave}
        onCancel={handleCancel}
        typeColor="action"
        initialShowForm={initialShowForm}
        disableSave={disabled}
      >
        {canDelete && (
          <OptionalFormSet.ExtraButton>
            <Button color="danger" onClick={handleDelete} disabled={disabled}>
              <FontAwesomeIcon icon="trash" />
            </Button>
          </OptionalFormSet.ExtraButton>
        )}
        <SolventListFormGroup
          label={'Mobile Phase'}
          solvents={formData.solvents}
          solventOptions={solventOptions}
          setSolvents={handleChangeFormData('solvents')}
          disabled={disabled}
        />
        <FormGroup>
          <MetricsInputFormGroup
            tooltipName={!disabled && 'purification_amount'}
            metricName={"VOLUME"}
            amount={formData.amount}
            onChange={handleChangeFormData('amount')}
            disabled={disabled}
          />
        </FormGroup>
        <FormGroup>
          <MetricsInputFormGroup
            metricName={'VELOCITY'}
            amount={formData.flow_rate}
            onChange={handleChangeFormData('flow_rate')}
            disabled={disabled}
          />
          <DurationSelection
            tooltipName={!disabled && 'purification_duration'}
            duration={formData.duration}
            onChangeDuration={handleChangeFormData('duration')}
            disabled={disabled}
          />
          <Label>Step</Label>
          <ButtonGroupToggle
            value={formData.step_mode}
            options={chromatographyOptions.step_modes}
            onChange={handleChangeFormData('step_mode')}
            disabled={disabled}
          />
          <Label>Prod</Label>
          <ButtonGroupToggle
            value={formData.prod_mode}
            options={chromatographyOptions.prod_modes}
            onChange={handleChangeFormData('prod_mode')}
            disabled={disabled}
          />
        </FormGroup>
      </OptionalFormSet>
    </>
  );
};

export default AnalysisChromatographyStepForm;
