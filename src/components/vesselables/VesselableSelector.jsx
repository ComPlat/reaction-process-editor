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
        <ModalHeader tag="h4">
          {buttonLabel} Vessel
        </ModalHeader>
        <ModalBody>
          <VesselableIndex
            onSelectVesselable={handleSelectVesselable}
            typeColor={typeColor}
            vesselOptions={vesselOptions}
          />
        </ModalBody>
        <ModalFooter>
          <Button outline color={typeColor} onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default VesselableSelector;
