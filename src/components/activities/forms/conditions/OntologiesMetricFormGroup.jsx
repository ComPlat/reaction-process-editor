import React, { useEffect, useState, useContext } from "react";

import EquipmentSubsetFormSection from "./EquipmentSubsetFormSection";
import EquipmentForm from "./EquipmentForm";
import ConditionMetricSubForm from "./ConditionMetricSubForm";
import MotionForm from "./MotionForm";

import ActivityInfoDecorator from "../../../../decorators/ActivityInfoDecorator";
import MetricsDecorator from "../../../../decorators/MetricsDecorator";

import { SelectOptions } from "../../../../contexts/SelectOptions";
import OntologySelectFormGroup from "../formgroups/OntologySelectFormGroup";

const OntologiesMetricFormGroup = ({
  metricName,
  precondition,
  label,
  workup,
  onWorkupChange,
  typeColor = "condition",
  ontologyId
}) => {
  const selectOptions = useContext(SelectOptions);

  const hasPrecondition = !!precondition?.value;
  const hasWorkupCondition = !!workup[metricName];

  const [metricForm, setMetricForm] = useState(workup || {})

  const findInitialValue = (key, fallBackValue) => {
    if (workup[metricName] && workup[metricName][key] !== undefined) {
      return workup[metricName][key];
    } else if (precondition && precondition[key] !== undefined) {
      return precondition[key];
    } else {
      return fallBackValue;
    }
  };

  const summary = () => {
    if (hasWorkupCondition) {
      return ActivityInfoDecorator.conditionInfo(
        metricName,
        workup[metricName],
        precondition,
        selectOptions
      );
    } else if (hasPrecondition) {
      return ActivityInfoDecorator.conditionInfo(
        metricName,
        precondition,
        null,
        selectOptions
      );
    } else {
      return undefined;
    }
  };

  const resetForm = () => {
    setMetricForm({ class: ontologyId, EQUIPMENT: [] })
  }

  // const [equipment, setEquipment] = useState([]);
  // const [type, setType] = useState();

  // const resetType = () => setType(workup["type"]);

  // const setONTOLOGIES = () => setType(workup["type"]);

  // const resetEquipment = () =>
  //   setEquipment(workup["EQUIPMENT"]?.["value"] || []);

  useEffect(() => {
    onWorkupChange({ name: 'class', value: ontologyId })
    // resetEquipment();
    resetForm();
    // resetType();
    // eslint-disable-next-line
  }, [workup]);

  const handleSave = (condition) => {
    onWorkupChange({ name: "EQUIPMENT", value: { value: metricForm.EQUIPMENT } });
    if (metricName !== "EQUIPMENT") {
      onWorkupChange({ name: metricName, value: condition });
      onWorkupChange({ name: "type", value: metricForm.type });
    }
  };

  const handleCancel = () => resetForm();

  // const handleChangeEquipment = (newEquipment) => setEquipment(newEquipment);

  const handleResetToPredifined = () => {
    onWorkupChange({ name: metricName, value: undefined });
  };

  const handleChangeForm = (name) => (selected) => {
    setMetricForm(
      { ...metricForm, [name]: selected }
    )
  }

  const renderMotionForm = () => {
    return (
      <MotionForm
        label={label || MetricsDecorator.label(metricName)}
        valueSummary={summary()}
        findInitialValue={findInitialValue}
        onSave={handleSave}
        onCancel={handleCancel}
      >
        <EquipmentSubsetFormSection
          valueSummary={summary()}
          equipment={metricForm.EQUIPMENT}
          metricName={metricName}
          onChangeEquipment={handleChangeForm('EQUIPMENT')}
        />
      </MotionForm>
    )
  }

  const renderEquipmentForm = () => {
    return (
      <div>
        <EquipmentForm
          metricName={metricName}
          equipment={metricForm.EQUIPMENT}
          isEqualToPredefinedValue={!hasWorkupCondition}
          onChangeEquipment={handleChangeForm('EQUIPMENT')}
          valueSummary={summary()}
          onSave={handleSave}
          onCancel={handleCancel}
        ></EquipmentForm>
      </div>
    )
  }

  const renderConditionMetricForm = () => {
    return (
      <ConditionMetricSubForm
        metricName={metricName}
        label={label}
        valueSummary={summary()}
        findInitialValue={findInitialValue}
        onSave={handleSave}
        isEqualToPredefinedValue={!hasWorkupCondition}
        typeColor={typeColor}
        onCancel={handleCancel}
        onResetToPredefined={handleResetToPredifined}
      >
        <EquipmentSubsetFormSection
          metricName={metricName}
          equipment={metricForm.EQUIPMENT}
          onChangeEquipment={handleChangeForm('EQUIPMENT')}
        />
        <OntologySelectFormGroup
          key={"type" + workup.type}
          roleName={'type'}
          workup={metricForm}
          onChange={e => handleChangeForm('type')(e.value)}
        />
      </ConditionMetricSubForm>
    )
  }

  switch (metricName) {
    case 'MOTION':
      return renderMotionForm();
    case 'EQUIPMENT':
      return renderEquipmentForm();
    default:
      return renderConditionMetricForm();
  }
};

export default OntologiesMetricFormGroup;
