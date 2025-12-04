import React from "react";

import VesselableFormSection from "../../../vesselables/VesselableFormSection";

const DiscardForm = ({ reactionProcessVessel, onChangeVessel }) => {

  return (
    <VesselableFormSection
      onChange={onChangeVessel}
      reactionProcessVessel={reactionProcessVessel}
    />
  );
};

export default DiscardForm;
