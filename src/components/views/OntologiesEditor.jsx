import React, { useEffect, useState } from 'react';

import { Input, Nav, NavItem, NavbarBrand } from "reactstrap";
import OntologyForm from '../ontologies/OntologyForm';

import { useReactionsFetcher } from "../../fetchers/ReactionsFetcher";

import { SelectOptions } from '../../contexts/SelectOptions';

const OntologiesEditor = () => {

  const [ontologies, setOntologies] = useState([])
  const reactionApi = useReactionsFetcher();

  const [ontologyQuery, setOntologyQuery] = useState('');

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
    window.addEventListener("ontologiesRequiresReload", fetchOntologies);

    return () => {
      window.removeEventListener("ontologiesRequiresReload", fetchOntologies);
    };
    // eslint-disable-next-line
  }, [])

  const fetchOntologies = () => {
    reactionApi.getOntologies().then((data) => {
      data?.ontologies && setOntologies([data.ontologies[0]]);
      data?.ontologies && setOntologies(data.ontologies);
    });
  };


  const handleChangeOntology = (ontology) => {
    console.log(ontology)
    window.dispatchEvent(new Event("ontologiesRequiresReload"));
  }

  return (
    <>
      <Nav fill className="navbar fixed-bottom bg-preparation border-top px-5">
        <NavbarBrand href="/">
          {'Ontologies: ' + filteredOntologies.length + ' / ' + ontologies.length}
        </NavbarBrand>
        <NavItem className="p-5">
          <Input
            placeholder={'Search Ontologies'}
            value={ontologyQuery}
            onChange={(event) => setOntologyQuery(event.target.value)}
          />
        </NavItem>
      </Nav>

      {filteredOntologies.map(ontology => {
        return (
          <SelectOptions.Provider value={ontologies}>
            <OntologyForm
              key={"ontology_" + ontology.id}
              ontology={ontology}
              onChange={handleChangeOntology} />
          </SelectOptions.Provider>
        )
      })}
    </>
  )

}

export default OntologiesEditor;
