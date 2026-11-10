import React from "react";

import ProcedureCard from "../utilities/ProcedureCard";
import VesselPreparation from "./VesselPreparation.jsx";

const VesselPreparationColumnCard = ({ reactionProcess }) => {
  const renderVesselPreparations = () => {
    return (
      <>
        {reactionProcess.reaction_process_vessels.map(
          (reaction_process_vessel, idx) => (
            <VesselPreparation
              key={idx}
              reactionProcessVessel={reaction_process_vessel}
              reactionProcessId={reactionProcess.id}
            />
          )
        )}
      </>
    );
  };

  return (
    <ProcedureCard
      title="Vessel Preparations"
      type="preparation"
      showEditBtn={false}
      showMoveBtn={false}
      showDeleteBtn={false}
      showCancelBtn={false}
      customClass="procedure-card--column"
    >
      <ProcedureCard.Details>
        {renderVesselPreparations()}
      </ProcedureCard.Details>
    </ProcedureCard>
  );
};

export default VesselPreparationColumnCard;
