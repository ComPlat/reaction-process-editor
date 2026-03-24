import React, { useEffect, useState } from 'react';

import { Input, Nav, NavItem, NavbarBrand, Button } from "reactstrap";
import OntologyForm from '../ontologies/OntologyForm';

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
      data?.ontologies && setOntologies([data.ontologies[0]]);
      data?.ontologies && setOntologies(data.ontologies);
    });
  };

  const initialOntology = { roles: {}, label: '', ontology_id: '', active: true, detectors: [], solvents: [], stationary_phase: [] }

  return (
    <>
      <SelectOptions.Provider value={ontologies}>
        <Nav fill className="navbar fixed-bottom bg-preparation px-5">
          <NavbarBrand>
            <Button onClick={e => setShowNewForm(true)}>+ Ontology</Button>
          </NavbarBrand>
          <NavItem>
            {'Ontologies: ' + filteredOntologies.length + ' / ' + ontologies.length}
          </NavItem>
          <NavItem className="p-5">
            <Input
              placeholder={'Search Ontologies'}
              value={ontologyQuery}
              onChange={(event) => setOntologyQuery(event.target.value)}
            />
          </NavItem>

        </Nav>
        <Nav  className="fixed-bottom bg-preparation px-5">
        {showNewForm ?
            <OntologyForm
              key={"ontology_new"}
              ontology={initialOntology}
              isOpen={true}
              onFinished={e => setShowNewForm(false)}
              />
          : <></>}

          </Nav>

        {filteredOntologies.map(ontology => {
          return (
            <OntologyForm
              key={"ontology_" + ontology.ontology_id}
              ontology={ontology}
            />
          )
        })}

      </SelectOptions.Provider>
    </>
  )

}

export default OntologiesEditor;
