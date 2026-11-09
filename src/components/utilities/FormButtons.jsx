import React from "react";
import { Button } from "reactstrap";

const FormButtons = ({
  onCancel,
  onSave,
  type,
  disabled,
  disableSave,
  saveLabel = "Save",
  children,
}) => {
  const classNames =
    "form-buttons d-grid gap-2 d-md-flex justify-content-md-end" +
    " form-buttons--" +
    type;

  return (
    <div className={classNames}>
      {children}
      <Button color={type} onClick={onCancel} disabled={!!disabled} outline>
        {disableSave ? 'Close' : 'Cancel'}
      </Button>
      <Button color={type} onClick={onSave} disabled={!!disabled || !!disableSave}>
        {saveLabel}
      </Button>
    </div>
  );
};

export default FormButtons;
