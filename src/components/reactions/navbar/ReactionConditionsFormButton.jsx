import React, { useState } from 'react'

import { UncontrolledTooltip } from 'reactstrap';

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
        id='reaction-conditions-button'
        icon='temperature-high'
        size='lg'
        positive={true}
        onClick={toggleModal}
      />
      < UncontrolledTooltip target='reaction-conditions-button' >
        Set the reaction's base conditions
      </UncontrolledTooltip >
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
