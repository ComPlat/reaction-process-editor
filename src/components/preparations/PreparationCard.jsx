import React from "react";
import ProcedureCard from "../utilities/ProcedureCard";

const PreparationCard = ({
  title,
  children,
  onEdit,
  onDelete,
  onCancel,
  customClass,
  allowDelete = true,
  showForm = false,
}) => {
  return (
    <ProcedureCard
      title={title}
      type="preparation"
      onEdit={onEdit}
      onDelete={onDelete}
      onCancel={onCancel}
      showEditBtn={!showForm}
      showMoveBtn={false}
      showDeleteBtn={allowDelete ? !showForm : false}
      showCancelBtn={showForm}
      displayMode={showForm ? "form" : "info"}
      customClass={customClass}
      headerTitleTag="h6"
    >
      {children}
    </ProcedureCard>
  );
};

export default PreparationCard;
