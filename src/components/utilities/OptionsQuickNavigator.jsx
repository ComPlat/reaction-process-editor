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

  const handleKeyInput = (event) => {
    if (event.key === "Enter" && !!filteredOptions[0]) { navigate(filteredOptions[0].path) }
  }

  const renderOptionsSelect = () => {
    let displayLabel = query.length && filteredOptions.length ? filteredOptions[0].label : label

    return (
      <UncontrolledDropdown nav>
        <DropdownToggle nav caret>
          {displayLabel}
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
      className="metrics-input navbar-direct-link">
      <div className='col-6'>
        <Input
          placeholder={label}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyUp={handleKeyInput}
        />
      </div>
      <div className='col-6'>
        {renderOptionsSelect()}
      </div>
    </InputGroup>
  );
};

export default OptionsQuickNavigator;
