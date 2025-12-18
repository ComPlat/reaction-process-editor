import React, { useState } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  InputGroup,
  Input,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import VesselableIndex from "./VesselableIndex";
import VesselableDecorator from "../../decorators/VesselableDecorator";

const VesselableSelector = ({
  currentVesselable,
  onSelectVesselable,
  vesselOptions,
  typeColor,
  buttonLabel
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showVesselTemplates, setShowVesselTemplates] = useState(true)
  const [showVessels, setShowVessels] = useState(false)

  const filteredVesselOptions = vesselOptions.filter(vessel => {
    console.log("filter")
    console.log(showVesselTemplates)
    return (showVesselTemplates && vessel.vesselable_type === 'VesselTemplate')
      || (showVessels && vessel.vesselable_type === 'Vessel')
  })

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleSelectVesselable = (vesselable) => () => {
    toggleModal();
    onSelectVesselable(vesselable);
  };

  return (
    <>
      <InputGroup>
        <Input
          value={VesselableDecorator.vesselableSingleLine(currentVesselable) || "-"}
          onClick={toggleModal}
          readOnly
        />
        <Button onClick={toggleModal} color={typeColor}>
          <FontAwesomeIcon icon="list" />
        </Button>
      </InputGroup>
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        backdrop={"static"}
        fullscreen={true}
        className={"modal--" + typeColor}
      >
        <ModalHeader tag="h4" className="d-flex justify-content-between">
          {buttonLabel}
          <Input className="col-2"
            type="checkbox"
            checked={showVesselTemplates}
            onChange={(event) =>
              setShowVesselTemplates(event.target.checked)
            } /> Vessel-Templates
          <Input
            type="checkbox"
            checked={showVessels}
            onChange={(event) =>
              setShowVessels(event.target.checked)
            } /> Vessels

          <span className="col-3"></span>
        </ModalHeader>
        <ModalBody>
          <VesselableIndex
            onSelectVesselable={handleSelectVesselable}
            typeColor={typeColor}
            vesselOptions={filteredVesselOptions}
          />
        </ModalBody>
        <ModalFooter>
          <Button outline color={typeColor} onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal >
    </>
  );
};

export default VesselableSelector;
