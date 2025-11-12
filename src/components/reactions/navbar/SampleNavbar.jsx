import React, { useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionItem,
  Button,
  Nav,
  Navbar,
  NavbarBrand,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleUp,
  faAngleDoubleDown,
} from "@fortawesome/free-solid-svg-icons";

import IconButton from "../../utilities/IconButton";
import OrdDownloadButton from "./OrdDownloadButton";
import ProvenanceFormButton from "./ProvenanceFormButton";
import ReactionConditionsFormButton from "./ReactionConditionsFormButton";

import SamplesDecorator from "../../../decorators/SamplesDecorator";

import {
  SubFormController,
  SubFormToggle,
} from "../../../contexts/SubFormController";

const SampleNavbar = ({ reactionProcess }) => {
  const [open, setOpen] = useState("scheme");
  const [schemeIsEnlarged, setSchemeIsEnlarged] = useState(false);
  const zoomIcon = schemeIsEnlarged ? "search-minus" : "search-plus";
  const schemeImageClass = schemeIsEnlarged
    ? "reaction-header__scheme-image reaction-header__scheme-image--enlarged"
    : "reaction-header__scheme-image";

  const toggleScheme = () => {
    if (open) {
      setOpen("");
    } else {
      setOpen("scheme");
    }
  };
  const toggleSchemeEnlarge = () => {
    setSchemeIsEnlarged(!schemeIsEnlarged);
  };

  const sample = reactionProcess.sample || {}
  return (
    <SubFormController.Provider value={SubFormToggle()}>
      <div className="reaction-header">
        <Navbar className="reaction-navbar bg-preparation" >
          <NavbarBrand>
            <span className="h3 reaction-name">
              Sample id {sample.id}: {sample.short_label}
            </span>
            <span className="reaction-id"> {sample.name}</span>
          </NavbarBrand>
          <Nav className="reaction-navbar bg-preparation" >
            <ReactionConditionsFormButton
              defaultConditions={reactionProcess.reaction_default_conditions}
              preconditions={reactionProcess.user_reaction_default_conditions}
            />
            <ProvenanceFormButton provenance={reactionProcess.provenance} />
            <OrdDownloadButton reactionProcessId={reactionProcess.id} />
          </Nav>
        </Navbar>
        <Accordion
          open={open}
          toggle={toggleScheme}
          flush
          className="bg-preparation container-fluid pb-2 reaction-header__scheme-accordion"
        >
          <AccordionItem>
            <AccordionBody accordionId="scheme" className="text-center">
              <div className="reaction-header__scheme-container">
                <img
                  src={SamplesDecorator.sampleSvgPath(sample)}
                  alt={sample.short_label}
                  className={schemeImageClass}
                />
                <div className="reaction-header__scheme-enlarge-button-container">
                  <IconButton
                    icon={zoomIcon}
                    size="lg"
                    onClick={toggleSchemeEnlarge}
                  />
                </div>
              </div>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
        <div className="text-center scheme-drawer-button-container">
          <Button
            color="preparation"
            className="scheme-drawer-button"
            size="sm"
            onClick={toggleScheme}
          >
            <FontAwesomeIcon
              icon={open ? faAngleDoubleUp : faAngleDoubleDown}
            />
            <span>Scheme</span>
            <FontAwesomeIcon
              icon={open ? faAngleDoubleUp : faAngleDoubleDown}
            />
          </Button>
        </div>
      </div>
    </SubFormController.Provider>
  );
};

export default SampleNavbar;
