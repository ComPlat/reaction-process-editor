import React, { useState } from "react";

import { Button, InputGroup, Input } from "reactstrap";

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
    if (event.key === "Enter") { navigate(filteredOptions[0].url) }
  }

  const renderSelectSubmitButton = () => {
    return (
      <Button color={'success'} disabled={ambigousOption}
        tag={Link}
        to={filteredOptions[0].url}
        className="main-header-name"
      >
        {filteredOptions[0].label}
      </Button >
    )
  }

  const renderOptionsSelect = () => {
    return (
      <UncontrolledDropdown nav>
        <DropdownToggle nav caret>
          {filteredOptions[0]?.label}
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
    <>
      <InputGroup>
        <Input
          placeholder={label}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyUp={handleKeyInput}
        />
        {ambigousOption ? renderOptionsSelect() : renderSelectSubmitButton()}
      </InputGroup>
    </>
  );
};

export default OptionsQuickNavigator;
