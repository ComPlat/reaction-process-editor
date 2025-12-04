import React, { useContext, useState } from "react";

import CreateButton from "../utilities/CreateButton";
import PreparationCard from "./PreparationCard";
import SamplePreparationInfo from "./SamplePreparationInfo";
import SamplePreparationForm from "./SamplePreparationForm";
import ProcedureCard from "../utilities/ProcedureCard";

import OptionsDecorator from "../../decorators/OptionsDecorator";

import { useActivityValidator } from "../../validators/ActivityValidator";

import { useReactionsFetcher } from "../../fetchers/ReactionsFetcher";

import { SelectOptions } from "../../contexts/SelectOptions";

const SamplePreparation = ({ preparation, reactionProcessId }) => {
  const api = useReactionsFetcher();
  const activityValidator = useActivityValidator();

  const selectOptions = useContext(SelectOptions);

  const [showForm, setShowForm] = useState(false);
  const [initPreparation, setInitPreparation] = useState(false);
  const preparationOptions = selectOptions.samples_preparations;

  const showCard = preparation || initPreparation;
  const sampleName = preparation
    ? OptionsDecorator.valueToLabel(
      preparation.sample_id,
      preparationOptions.preparable_samples
    )
    : "";
  const cardTitle = preparation ? sampleName : "New Preparation";

  const onDelete = () => {
    api.deleteSamplePreparation(reactionProcessId, preparation.id);
    closeForm();
  };

  const onSave = (preparationForm) => {
    if (activityValidator.validateSamplePreparation(preparationForm)) {
      api.updateSamplePreparation(reactionProcessId, preparationForm);
      closeForm();
    }
  };

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setInitPreparation(false);
  };

  const createPreparation = () => {
    setShowForm(true);
    setInitPreparation(true);
  };

  return showCard ? (
    <PreparationCard
      title={cardTitle}
      onEdit={openForm}
      onDelete={onDelete}
      onCancel={closeForm}
      showForm={showForm}
    >
      <ProcedureCard.Info>
        <SamplePreparationInfo
          preparation={preparation}
          preparationOptions={preparationOptions}
        />
      </ProcedureCard.Info>
      <ProcedureCard.Form>
        <SamplePreparationForm
          preparation={preparation}
          preparationOptions={preparationOptions}
          onSave={onSave}
          onCancel={closeForm}
        />
      </ProcedureCard.Form>
    </PreparationCard>
  ) : (
    <CreateButton
      label="New Sample"
      type="preparation"
      onClick={createPreparation}
    />
  );
};

export default SamplePreparation;
