import React, { useState } from "react";

import { Button, InputGroup, Input, Row } from "reactstrap";

import { useNavigate } from 'react-router-dom'

import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

import { Link } from "react-router-dom";

const OptionsQuickNavigator = ({ options, label }) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');

  const optionMatchesQuery = (option) => option.label?.toLowerCase().match(query.toLowerCase())

  const filteredOptions = options
    .filter(option => optionMatchesQuery(option))
    .map(option => { return { ...option, value: option.key, label: option.label } })

  const ambigousOption = filteredOptions.length !== 1


  const handleKeyInput = (event) => {
    console.log(event.key)
    console.log(filteredOptions[0])
    if (event.key === "Enter" && !!filteredOptions[0]) { navigate(filteredOptions[0].path) }
  }

  const renderSelectSubmitButton = () => {
    return (
      <Button color={'success'}
        tag={Link}
        to={filteredOptions[0]?.path}
        className="main-header-name"
      >
        {filteredOptions[0]?.label || "No Match"}
      </Button >
    )
  }

  const renderOptionsSelect = () => {
    return (
      <UncontrolledDropdown nav>
        <DropdownToggle nav caret>
          {label}
          {' '}
          ({filteredOptions.length})
        </DropdownToggle>
        {filteredOptions?.length > 0 ?
          <DropdownMenu>
            {filteredOptions.map((sample) => (
              <DropdownItem
                key={sample.key}
                tag={Link}
                to={sample.path}
              >
                {sample.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
          : <></>}
      </UncontrolledDropdown>
    )
  }

  return (
    <InputGroup
      className="metrics-input">

      <div className='col-6'>
        <Input
          placeholder={label}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyUp={handleKeyInput}
        />
      </div>
      <div className='col-6'>
        {filteredOptions.length > 1 ? renderOptionsSelect() : renderSelectSubmitButton()}
      </div>

    </InputGroup>
  );
};

export default OptionsQuickNavigator;
