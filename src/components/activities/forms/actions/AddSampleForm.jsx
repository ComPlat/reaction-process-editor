import React, { useEffect, useState, useContext } from "react";
import { FormGroup, Label, Input } from "reactstrap";
import Select from "react-select";
import PropTypes from "prop-types";

import AmountInputSet from "../../../utilities/AmountInputSet";
import FormSection from "../../../utilities/FormSection";
import MetricsInputFormGroup from "../formgroups/MetricsInputFormGroup";
import SingleLineFormGroup from "../formgroups/SingleLineFormGroup";
import SamplesIconSelect from "../../../utilities/SamplesIconSelect";

import MetricsDecorator from "../../../../decorators/MetricsDecorator";
import OptionsDecorator from "../../../../decorators/OptionsDecorator";

import { SelectOptions } from "../../../../contexts/SelectOptions";
import SampleSelection from "../../../utilities/SampleSelection";

const AddSampleForm = ({ workup, preconditions, onWorkupChange }) => {
  // TODO: move to metrics.jsx (and restrict to keys; requires some work as workup_keys depend on it)
  const inputMetrics = [
    ["VELOCITY", "add_sample_velocity"],
    ["TEMPERATURE", "add_sample_temperature"],
    ["PRESSURE", "add_sample_pressure"],
  ];

  const selectOptions = useContext(SelectOptions)
  const additionOptions = selectOptions.FORMS.ADD

  useEffect(() => {
    inputMetrics.forEach(([metricName, workupKey]) => {
      const unit =
        workup[workupKey]?.unit ||
        preconditions[metricName]?.unit ||
        MetricsDecorator.defaultUnit(metricName);

      let value = workup[workupKey]?.value;
      value = value === 0 ? 0 : value || preconditions[metricName]?.value;

      if (value || value === 0) {
        onWorkupChange({
          name: workupKey,
          value: { value: value, unit: unit },
        });
      }
    });

    workup["addition_speed_type"] ||
      onWorkupChange({
        name: "addition_speed_type",
        value: additionOptions.addition_speed_types[0].value,
      });
    // eslint-disable-next-line
  }, []);

  // 'DIVERSE_SOLVENT' shall be categorized as 'SOLVENT' in AddSample, requested by NJung.
  const currentSampleActsAs =
    workup["acts_as"] === "DIVERSE_SOLVENT" ? "SOLVENT" : workup["acts_as"];
  const currentSampleOptions = selectOptions.materials[currentSampleActsAs] || [];

  const [sample, setSample] = useState(
    currentSampleOptions.find(
      (sample) =>
        sample.value === workup["sample_id"] &&
        sample.label === workup["sample_name"]
    )
  );

  const handleSampleChange = ({ sampleId, label }) => {
    // We have a risk of collisions on sampleID alone as we are coping with 2 different ActiveRecord
    // models (Solvent, DiverseSolvent). So we also compare the label.
    const newSample = currentSampleOptions.find(
      (sample) => sample.value === sampleId && sample.label === label
    );
    if (newSample) {
      onWorkupChange({ name: "acts_as", value: newSample.acts_as });
      onWorkupChange({ name: "sample_id", value: newSample.id });
      onWorkupChange({ name: "sample_name", value: newSample.label });

      // We want to retain current amounts in workup when selected Sample has unspecified amount (Additives, Solvents …)
      newSample.amount?.value &&
        onWorkupChange({ name: "target_amount", value: newSample.amount });
      newSample.amount?.value &&
        onWorkupChange({
          name: "sample_original_amount",
          value: newSample.amount,
        });
    }
    setSample(newSample);
  };

  const handleChange = (name) => (value) =>
    onWorkupChange({ name: name, value: value });

  const renderConditionInputs = () => {
    return inputMetrics.map(([metricName, workupKey]) => {
      return (
        <>
          <MetricsInputFormGroup
            key={metricName}
            metricName={metricName}
            amount={workup[workupKey]}
            onChange={handleChange(workupKey)}
          />
        </>
      );
    });
  };

  return (
    <>
      <FormSection type="action">
        {currentSampleActsAs === "SAMPLE" ? (
          <SampleSelection
            sampleOptions={currentSampleOptions}
            sample={sample}
            onChange={handleSampleChange}
          />
        ) : (
          <SingleLineFormGroup label="Solvent">
            <Select
              className="react-select--overwrite"
              classNamePrefix="react-select"
              name="sample_id"
              options={currentSampleOptions}
              value={sample}
              onChange={(selected) =>
                handleSampleChange({
                  sampleId: selected.value,
                  label: selected.label,
                })
              }
            />
          </SingleLineFormGroup>
        )}
        {currentSampleActsAs === "SOLVENT" && (
          <SingleLineFormGroup label="abs." check className="mb-3">

            <Input
              type="checkbox"
              checked={workup["is_waterfree_solvent"]}
              onChange={(event) =>
                handleChange("is_waterfree_solvent")(event.target.checked)
              }
            />

          </SingleLineFormGroup>
        )}
        <FormGroup>
          <Label>Molecular Entity</Label>
          <SamplesIconSelect
            isMulti
            isClearable={false}
            options={selectOptions.materials['MOLECULAR_ENTITY']}
            samples={workup.molecular_entitites}
            onChange={handleChange('molecular_entities')}
          />
        </FormGroup>

        <AmountInputSet
          amount={workup["target_amount"]}
          maxAmounts={sample?.unit_amounts}
          onChangeAmount={handleChange("target_amount")}
        />
      </FormSection>
      <FormSection type="action">
        <SingleLineFormGroup label="Addition">
          <Select
            className="react-select--overwrite"
            classNamePrefix="react-select"
            name="addition_speed_type"
            options={additionOptions.addition_speed_types}
            value={OptionsDecorator.optionForValue(workup["addition_speed_type"], additionOptions.addition_speed_types)}
            onChange={(selected) =>
              handleChange("addition_speed_type")(selected.value)
            }
          />
        </SingleLineFormGroup>

        {renderConditionInputs()}
      </FormSection>
    </>
  );
};

AddSampleForm.propTypes = {
  workup: PropTypes.object.isRequired,
  preconditions: PropTypes.object.isRequired,
  onWorkupChange: PropTypes.func.isRequired,
};

export default AddSampleForm;
