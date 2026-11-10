import React, { useContext, useEffect, useState } from "react";
import { Button, FormGroup, Label } from "reactstrap";

import FormButtons from "../../../utilities/FormButtons";
import FormSection from "../../../utilities/FormSection";

import { SubFormController } from "../../../../contexts/SubFormController";

const ExtraButton = () => null;

const OptionalFormSet = ({
  subFormLabel,
  valueSummary,
  onSave,
  onCancel,
  children,
  isEqualToPredefinedValue = false,
  typeColor = "condition",
  disableFormButtons,
  disableSave,
  disabled,
  initialShowForm = false,
}) => {
  const subFormController = useContext(SubFormController);
  const [showForm, setShowForm] = useState();

  useEffect(() => {
    setShowForm(subFormController.isCurrentOpen(subFormLabel));
  }, [subFormController, subFormLabel]);

  const childNodes = React.Children.toArray(children);
  const extraButton = childNodes.find((el) => el.type === ExtraButton);

  useEffect(() => {
    if (initialShowForm) {
      toggleShowForm();
    }
    // eslint-disable-next-line
  }, []);

  const toggleShowForm = () => {
    subFormController.toggleSubForm(subFormLabel);
    setShowForm(!showForm);
  };

  const hasLocalValue = !!valueSummary && !isEqualToPredefinedValue;
  const toggleFormButtonLabel = disableSave ? 'View' : hasLocalValue ? "Change" : "Set";

  const handleSave = (data) => {
    toggleShowForm();
    onSave(data);
  };

  const handleCancel = () => {
    toggleShowForm();
    onCancel();
  };

  return (
    <FormSection name={subFormLabel} type={typeColor}>
      {!showForm && (
        <div className="d-flex justify-content-between align-self-center">
          <Label
            className={
              "col-form-label" + (hasLocalValue ? "" : " label--disabled")
            }
          >
            <span>{subFormLabel}:</span>{' '}
            <span className="fw-normal">{valueSummary || "-"}</span>
          </Label>
          {!disabled &&
            <div className="optional-form-group__open-controls">
              <div className="d-grid gap-2">
                <Button color={typeColor} onClick={toggleShowForm} outline disabled={disabled}>
                  {toggleFormButtonLabel}
                </Button>
              </div>
            </div>
          }
        </div>
      )}
      {showForm && (
        <>
          <FormGroup>
            <Label>{subFormLabel}</Label>
            {children}
          </FormGroup>
          <FormButtons
            type={typeColor}
            onSave={handleSave}
            onCancel={handleCancel}
            saveLabel="Set"
            disabled={disableFormButtons}
            disableSave={disableSave}
          >
            {extraButton && extraButton.props.children}
          </FormButtons>
        </>
      )}
    </FormSection>
  );
};

OptionalFormSet.ExtraButton = ExtraButton;

export default OptionalFormSet;
