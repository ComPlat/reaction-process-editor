import React, { useState } from 'react'

import IconButton from "../../utilities/IconButton";
import DefaultConditionsFormModal from "../../utilities/DefaultConditionsFormModal";

const ReactionConditionsFormButton = (
  {
    preconditions,
    defaultConditions
  }) => {

  const [showModal, setShowModal] = useState(false)
  const toggleModal = () => { setShowModal(!showModal) }

  return (
    <>
      <IconButton
        title="Set the reaction's base conditions"
        icon='temperature-high'
        size='lg'
        positive={true}
        onClick={toggleModal}
      />
      <DefaultConditionsFormModal
        preconditions={preconditions}
        defaultConditions={defaultConditions}
        scope='Reaction'
        onToggleModal={toggleModal}
        isOpen={showModal}
      />
    </>
  )
}

export default ReactionConditionsFormButton
