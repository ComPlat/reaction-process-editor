import React, { useContext, useState } from "react";

import PreparationCard from "./PreparationCard";
import ProcedureCard from "../utilities/ProcedureCard";
import VesselPreparationForm from "./VesselPreparationForm";
import VesselableDecorator from "../../decorators/VesselableDecorator";
import OptionsDecorator from "../../decorators/OptionsDecorator";

import { useReactionsFetcher } from "../../fetchers/ReactionsFetcher";

import { SelectOptions } from "../../contexts/SelectOptions";

const VesselPreparation = ({ reactionProcessVessel }) => {
  const api = useReactionsFetcher();

  const selectOptions = useContext(SelectOptions);

  const [showForm, setShowForm] = useState(false);
  const preparationOptions =
    selectOptions.vessel_preparations.preparation_types;

  const onSave = (preparationForm) => {
    api.updateReactionProcessVessel(preparationForm);
    closeForm();
  };

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const title = (
    <div className="d-md-flex gap-2">
      {reactionProcessVessel.step_names.length > 0 ? (
        <span>
          {reactionProcessVessel.step_names.join(", ")}
          {" – "}
        </span>)
        : (<>Initital - </>)
      }
      {VesselableDecorator.vesselTitle(reactionProcessVessel?.vesselable)}
    </div>
  )

  return (
    <PreparationCard
      title={title}
      onEdit={openForm}
      onCancel={closeForm}
      showForm={showForm}
      allowDelete={false}
      headerTitleTag="h6"
    >
      <ProcedureCard.Info>
        <span className="procedure-card__info-line">
          {VesselableDecorator.vesselVolumeAndMaterial(reactionProcessVessel.vesselable)}

          {reactionProcessVessel.preparations.length > 0 && (
            <>
              {' – '}
              {OptionsDecorator.valuesToLabel(reactionProcessVessel.preparations, preparationOptions
              )}
            </>
          )}
        </span>
      </ProcedureCard.Info>
      <ProcedureCard.Form>
        <VesselPreparationForm
          reactionProcessVessel={reactionProcessVessel}
          onSave={onSave}
          onCancel={closeForm}
        />
      </ProcedureCard.Form>
    </PreparationCard>
  );
};

export default VesselPreparation;
