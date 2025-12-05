import React, { useContext, useState } from "react";
import { Input, Label, FormGroup, Row, Col, Button } from "reactstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import MetricsInputFormGroup from "../formgroups/MetricsInputFormGroup";
import OptionalFormSet from "../formsets/OptionalFormSet";

import MetricsDecorator from "../../../../decorators/MetricsDecorator";
import OptionsDecorator from "../../../../decorators/OptionsDecorator";

import { SelectOptions } from "../../../../contexts/SelectOptions";
import { SubFormController } from "../../../../contexts/SubFormController";

const ConditionMetricSubForm = ({
  metricName,
  label,
  valueSummary,
  children,
  findInitialValue,
  onSave,
  onCancel,
  isEqualToPredefinedValue,
  typeColor = "condition",
  onResetToPredefined,
}) => {
  const subFormController = useContext(SubFormController);
  const selectOptions = useContext(SelectOptions);
  const additionalInformationOptions = selectOptions.FORMS.CONDITION.additional_information[metricName];

  const formLabel = label || MetricsDecorator.label(metricName);

  const initialAmount = () => {
    // return {
    //   value: findInitialValue(
    //     "value",
    //     MetricsDecorator.defaultValueInDefaultUnit(metricName)
    //   ),
    //   unit: findInitialValue("unit", MetricsDecorator.defaultUnit(metricName)),
    // };
  };

  const initialPowerAmount = () =>
    findInitialValue("power", MetricsDecorator.defaultAmount("POWER"));
  const initialPowerEndAmount = () =>
    findInitialValue("power_end", MetricsDecorator.defaultAmount("POWER_END"));

  const initialPowerRamp = () => findInitialValue("power_is_ramp", false);
  const initialAdditionalInformation = () =>
    findInitialValue("additional_information", "");

  const [amount, setAmount] = useState(initialAmount());
  const [powerAmount, setPowerAmount] = useState(initialPowerAmount());
  const [powerRamp, setPowerRamp] = useState(initialPowerRamp());
  const [powerEndAmount, setPowerEndAmount] = useState(initialPowerEndAmount());
  const [additionalInformation, setAdditionalInformation] = useState(
    initialAdditionalInformation()
  );

  const resetFormData = () => {
    setAmount(initialAmount());
    setPowerAmount(initialPowerAmount());
    setPowerRamp(initialPowerRamp());
    setPowerEndAmount(initialPowerEndAmount());
    setAdditionalInformation(initialAdditionalInformation());
  };

  const renderPowerForm = () => {
    return (
      <FormGroup>
        <FormGroup check>
          <Input
            type="checkbox"
            checked={!!powerRamp}
            onChange={(event) => setPowerRamp(event.target.checked)}
          />
          <Label check>{"Power Ramp"}</Label>
        </FormGroup>
        <MetricsInputFormGroup
          metricName={"POWER_START"}
          amount={powerAmount}
          onChange={setPowerAmount}
        />
        {!!powerRamp && (
          <MetricsInputFormGroup
            metricName={"POWER_END"}
            amount={powerEndAmount}
            onChange={setPowerEndAmount}
          />
        )}
      </FormGroup>
    );
  };

  const renderAdditionalInformationSelect = () => {
    return (
      <FormGroup>
        <Label>Additional Information</Label>
        <Select
          className="react-select--overwrite"
          classNamePrefix="react-select"
          name="additional_information"
          options={additionalInformationOptions}
          value={OptionsDecorator.optionForValue(additionalInformation, additionalInformationOptions)}
          onChange={(selectedOption) =>
            setAdditionalInformation(selectedOption.value)
          }
        />
      </FormGroup>
    );
  };

  const handleSave = () => {
    let condition = {
      value: amount.value,
      unit: amount.unit,
      additional_information: additionalInformation,
    };

    if (metricName === "IRRADIATION") {
      condition.power = powerAmount;
      if (powerRamp) {
        condition.power_is_ramp = powerRamp;
        condition.power_end = powerEndAmount;
      }
    }
    onSave(condition);
  };

  const handleCancel = () => {
    resetFormData();
    onCancel();
  };

  const handleReset = () => {
    subFormController.toggleSubForm(formLabel);
    onResetToPredefined();
  };
  return (
    <OptionalFormSet
      subFormLabel={formLabel}
      valueSummary={valueSummary}
      onSave={handleSave}
      onCancel={handleCancel}
      isEqualToPredefinedValue={isEqualToPredefinedValue}
      typeColor={typeColor}
    >
      <OptionalFormSet.ExtraButton>
        <Button color="condition" onClick={handleReset} outline>
          <FontAwesomeIcon icon="undo-alt" /> Reset
        </Button>
      </OptionalFormSet.ExtraButton>
      <Row className="gx-1 mb-3">
        <Col md={12}>
          <MetricsInputFormGroup
            metricName={metricName}
            amount={amount}
            onChange={setAmount}
            displayMultiLine={true}
          />
        </Col>
      </Row>
      {metricName === "IRRADIATION" && renderPowerForm()}
      {additionalInformationOptions?.length > 0 &&
        renderAdditionalInformationSelect()}
      {children}
    </OptionalFormSet>
  );
};

export default ConditionMetricSubForm;
