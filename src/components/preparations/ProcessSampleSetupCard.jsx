import React, { useContext, useState } from "react";

import ProcedureCard from "../utilities/ProcedureCard";

import VesselableFormSection from "../vesselables/VesselableFormSection";

import SamplesDecorator from "../../decorators/SamplesDecorator";
import SingleLineFormGroup from "../activities/forms/formgroups/SingleLineFormGroup";

import { SelectOptions } from "../../contexts/SelectOptions";

import FormButtons from "../utilities/FormButtons";

import VesselableDecorator from "../../decorators/VesselableDecorator";
import OptionsDecorator from "../../decorators/OptionsDecorator";

import { useReactionsFetcher } from "../../fetchers/ReactionsFetcher";

const ProcessSampleSetupCard = ({ reactionProcess }) => {
  const api = useReactionsFetcher()
  const selectOptions = useContext(SelectOptions);

  const currentSample = reactionProcess.sample || {};

  const [reactionProcessVessel, setReactionProcessVessel] = useState(reactionProcess.reaction_process_vessel);

  const vesselPreparationOptions = selectOptions.vessel_preparations.preparation_types || {};

  const [showForm, setShowForm] = useState(false);

  const handleSave = () => {
    api.updateReactionProcess(reactionProcess.id,
      { 'reaction_process_vessel': reactionProcessVessel });
    closeForm();
  };

  const handleCancel = () => {
    setReactionProcessVessel(reactionProcess?.reaction_process_vessel);
    closeForm();
  }

  const displayMode = () => {
    return showForm ? "form" : "info";
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const toggleForm = () => setShowForm(!showForm);

  const renderSampleFormGroup = () => {
    return (
      <SingleLineFormGroup label={SamplesDecorator.sampleSvgImg(currentSample)}>
        <span className="sample-id">{currentSample.short_label}</span>
        {SamplesDecorator.infoAvailableAmounts(currentSample['amounts'])}
      </SingleLineFormGroup>
    )
  }

  return (
    <ProcedureCard
      title="Initial"
      type="preparation"
      showEditBtn={!showForm}
      showMoveBtn={false}
      showDeleteBtn={false}
      showCancelBtn={showForm}
      onEdit={toggleForm}
      onCancel={closeForm}
      showForm={showForm}
      displayMode={displayMode()}
      customClass="procedure-card--column"
    >
      <ProcedureCard.Info>
        {renderSampleFormGroup()}
        {reactionProcessVessel?.vesselable ?
          <>
            <span className="procedure-card__info-line">
              {VesselableDecorator.vesselableType(reactionProcessVessel.vesselable)}
            </span>
            <span className="procedure-card__info-line">
              {VesselableDecorator.vesselVolumeAndMaterial(reactionProcessVessel.vesselable)}
            </span>
            {reactionProcessVessel.preparations?.length > 0 && (
              <span className="procedure-card__info-line">
                Preparations: {" "}
                {OptionsDecorator.valuesToLabel(reactionProcessVessel.preparations, vesselPreparationOptions
                )}
              </span>
            )}
          </> : <>No vessel assigned</>
        }
      </ProcedureCard.Info>
      <ProcedureCard.Form>
        {renderSampleFormGroup()}
        <VesselableFormSection
          onChange={setReactionProcessVessel}
          reactionProcessVessel={reactionProcessVessel}
          typeColor="step"
        />
        <FormButtons
          onSave={handleSave}
          onCancel={handleCancel}
          type="step"
        />

      </ProcedureCard.Form>
    </ProcedureCard>
  );
};

export default ProcessSampleSetupCard;
