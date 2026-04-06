import React, { useEffect, useState } from 'react';

import { Input, Nav, NavItem, NavbarBrand, Button } from "reactstrap";

import OntologyListItem from '../ontologies/OntologyListItem';
import OntologyFormModal from '../ontologies/OntologyFormModal';

import { useReactionsFetcher } from "../../fetchers/ReactionsFetcher";

import { SelectOptions } from '../../contexts/SelectOptions';

const OntologiesEditor = () => {
  const [ontologies, setOntologies] = useState([])
  const reactionApi = useReactionsFetcher();

  const [ontologyQuery, setOntologyQuery] = useState('');

  const [showNewForm, setShowNewForm] = useState(false)

  const ontologyMatchesQuery = (ont) => {
    return ont.ontology_id?.toLowerCase().match(ontologyQuery?.toLowerCase())
      || ont.label?.toLowerCase().match(ontologyQuery?.toLowerCase())
      || ont.name?.toLowerCase().match(ontologyQuery?.toLowerCase())
  }

  const filteredOntologies = ontologies.filter((ont) => ontologyMatchesQuery(ont))

  useEffect(() => {
    if (localStorage.getItem("bearer_auth_token")) {
      fetchOntologies();
    }
    window.addEventListener("requireReload", fetchOntologies);

    return () => {
      window.removeEventListener("requireReload", fetchOntologies);
    };
    // eslint-disable-next-line
  }, [])

  const fetchOntologies = () => {
    reactionApi.getOntologies().then((data) => {
      data?.ontologies && setOntologies(data.ontologies);
    });
  };

  const initialOntology = {
    roles: {}, label: '', name:'', ontology_id: '', ontology_type: "CUSTOM_TERMINOLOGY",
    active: true, detectors: [], solvents: [], stationary_phase: []
  }

  return (
    <>
      <SelectOptions.Provider value={{ ontologies: ontologies }}>
        <Nav fill className="navbar fixed-bottom bg-preparation px-5">
          <NavbarBrand>
            {'Ontologies: ' + filteredOntologies.length + ' / ' + ontologies.length}
          </NavbarBrand>
          <NavItem className="p-5">
            <Input
              placeholder={'Search Ontologies'}
              value={ontologyQuery}
              onChange={(event) => setOntologyQuery(event.target.value)}
            />
          </NavItem>
          <NavItem>
            <Button onClick={e => setShowNewForm(true)}>+ Ontology</Button>
          </NavItem>
        </Nav>
        <Nav fill className="fixed-bottom bg-preparation px-5">
          <NavItem>
            <OntologyFormModal
              key={"ontology_new"}
              ontology={initialOntology}
              isOpen={showNewForm}
              onClose={e => setShowNewForm(false)}
            />
          </NavItem>
        </Nav>

        <table className="table table-striped w-auto">
          <tbody>
            {filteredOntologies.map(ontology => {
              return (
                <tr>
                  <OntologyListItem
                    key={"ontology_" + ontology.ontology_id}
                    ontology={ontology}
                  />
                </tr>
              )
            })}
          </tbody>
        </table >
      </SelectOptions.Provider>
    </>
  )
}

export default OntologiesEditor;
