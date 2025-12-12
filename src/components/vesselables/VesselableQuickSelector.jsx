import React, { useContext, useEffect, useState } from "react";

import { Button, Col, InputGroup, Input } from "reactstrap";

import { VesselOptions } from "../../contexts/VesselOptions";
import Select from "react-select";

const VesselableQuickSelector = ({
  currentVesselable,
  onSelectVesselable,
  typeColor,
}) => {

  useEffect(() => {
    if (currentVesselable && !filteredVesselableOptions.find(v => v.id === currentVesselable?.id)) {
      setVesselQuery('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVesselable])

  const vesselables = useContext(VesselOptions);

  const [vesselQuery, setVesselQuery] = useState('');

  const vesselMatchesQuery = (vessel) => {
    return vessel.short_label?.toLowerCase().match(vesselQuery?.toLowerCase())
      || vessel.material_type?.toLowerCase().match(vesselQuery?.toLowerCase())
      || vessel.name?.toLowerCase().match(vesselQuery?.toLowerCase())
  }

  const filteredVesselableOptions = vesselables.filter(vessel => vesselMatchesQuery(vessel))

  const currentVesselSuggestion =
    vesselQuery.length > 0 ?
      filteredVesselableOptions.find(v => v.id === currentVesselable?.id)
      || filteredVesselableOptions[0]
      :
      undefined

  const suggestionUnique = filteredVesselableOptions.length === 1

  const selectFirstVessel = () => {
    onSelectVesselable(currentVesselSuggestion)
  }

  const handleVesselInputKeyUp = (event) => {
    if (event.key === "Enter") {
      selectFirstVessel()
    }
  }

  const handleSelectVesselable = (vesselable) => {
    onSelectVesselable(vesselable);
  };

  const renderVesselSelectSubmitButton = () => {
    return (
      <Button onClick={selectFirstVessel} color={typeColor} disabled={!suggestionUnique} >
        {currentVesselSuggestion.label}
      </Button >
    )
  }

  const renderVesselSelect = () => {
    return (
      <Select
        key={"filtered-vessels-" + filteredVesselableOptions.length + "-" + currentVesselable?.id}
        className="react-select--overwrite"
        classNamePrefix="react-select"
        name="filteredVesselableOptions"
        options={filteredVesselableOptions}
        value={currentVesselSuggestion}
        onChange={handleSelectVesselable}
        disabled={currentVesselSuggestion?.id === currentVesselable?.id}
        placeholder={"Select Vessel"}
      />
    )
  }

  return (
    <>
      <InputGroup>
        <Col md={5}>
          <Input
            placeholder={'Find Vessel by Label'}
            value={vesselQuery}
            onChange={(event) => setVesselQuery(event.target.value)}
            onKeyUp={handleVesselInputKeyUp}
          />
        </Col>
        <Col md={2} className="text-center">
          {'(' + filteredVesselableOptions.length + ')'}
        </Col>
        <Col md={5}>
          {suggestionUnique ? renderVesselSelectSubmitButton() : renderVesselSelect()}
        </Col>
      </InputGroup>
    </>
  );
};

export default VesselableQuickSelector;
