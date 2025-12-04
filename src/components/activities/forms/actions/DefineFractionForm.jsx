import React from "react";

import VesselableFormSection from "../../../vesselables/VesselableFormSection";

const DefineFractionForm = ({ reactionProcessVessel, onChangeVessel }) => {

  return (
    <VesselableFormSection
      onChange={onChangeVessel}
      reactionProcessVessel={reactionProcessVessel}
    />
  );
};

export default DefineFractionForm;
