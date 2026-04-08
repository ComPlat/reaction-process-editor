import React, { useState } from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Input, UncontrolledTooltip } from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DefaultConditionsFormModal from "../utilities/DefaultConditionsFormModal";
import { useAuthenticationFetcher } from "../../fetchers/AuthenticationFetcher";

import { tooltips } from "../../constants/translations";

const UserMenu = (
  {
    preconditions,
    defaultConditions,
  }) => {

  const api = useAuthenticationFetcher()
  const [showModal, setShowModal] = useState(false)
  const toggleModal = () => { setShowModal(!showModal) }

  const toggleShowSpinner = (event) => {
    localStorage.setItem("showSpinner", showSpinner ? "false" : "true")
    setShowSpinner(!showSpinner)
  }

  const [showSpinner, setShowSpinner] = useState(localStorage.getItem("showSpinner") === "true")

  return (
    <>
      <DefaultConditionsFormModal
        preconditions={preconditions}
        defaultConditions={defaultConditions}
        scope='User'
        onToggleModal={toggleModal}
        isOpen={showModal}
      />
      <UncontrolledDropdown nav className='user-drop-down'>
        <DropdownToggle className='user-drop-down__toggle'>
          <FontAwesomeIcon icon="user-circle" className="me-2 h2 mb-0" />
          {localStorage.getItem('username')}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={toggleModal}>
            <FontAwesomeIcon icon='temperature-high' /> User Default Conditions
          </DropdownItem>
          <DropdownItem>
            <Input
              className={"me-2"}
              id="reload_spinner"
              type="checkbox"
              checked={showSpinner}
              onChange={toggleShowSpinner}
            />
            Show reload spinner
            <UncontrolledTooltip
              target="reload_spinner"
            >
              {tooltips['reload_spinner']}
            </UncontrolledTooltip>
          </DropdownItem>
          <DropdownItem onClick={api.signOut}>
            <FontAwesomeIcon icon='sign-out' /> Logout
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  )
}

export default UserMenu
