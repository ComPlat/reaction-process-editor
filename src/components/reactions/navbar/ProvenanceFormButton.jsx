import React, { useState } from 'react'

import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import ProvenanceForm from './ProvenanceForm';
import IconButton from "../../utilities/IconButton";

const ProvenanceFormButton = ({ provenance }) => {

  const [showModal, setShowModal] = useState(false)
  const toggleModal = () => { setShowModal(!showModal) }

  return (
    <>
      <IconButton
        title="Edit the reaction's provenance metadata"
        icon='pen'
        size='lg'
        positive={true}
        onClick={toggleModal}
      />
      <Modal
        className='modal--primary d-flex align-items-center justify-content-center'
        isOpen={showModal}
        autoFocus={true}
        toggle={toggleModal}
        backdrop={"static"}
      >
        <ModalHeader>Reaction Process Provenance</ModalHeader>
        <ModalBody>
          <ProvenanceForm provenance={provenance} closeForm={toggleModal} />
        </ModalBody>
      </Modal>
    </>
  )
}

export default ProvenanceFormButton
