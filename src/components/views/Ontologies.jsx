import React, { useEffect, useState } from 'react';

// import { SelectOptions } from '../../contexts/SelectOptions';
import OntologyForm from '../ontologies/OntologyForm';

import { useReactionsFetcher } from "../../fetchers/ReactionsFetcher";



const Ontologies = () => {

  const [ontologies, setOntologies] = useState([])
  const reactionApi = useReactionsFetcher();

  useEffect(() => {
    console.log("useEffect")
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
      console.log("fetchOntologies")
      console.log(data)
      data?.ontologies && setOntologies([data.ontologies[0]]);  // restrict to 1 for development
      // data?.ontologies && setOntologies(data.ontologies[0]);
    });
  };


  const handleChangeOntology = (ontology) => {
    console.log(ontology)
    window.dispatchEvent(new Event("ontologiesRequiresReload"));
  }

  return (
    <>
      Ontologies
      {ontologies.length}
      {ontologies.map(ontology => {
        return (
          <OntologyForm
            key={"ontology_" + ontology.id}
            ontology={ontology}
            ontologyOptions={ontologies}
            onChange={handleChangeOntology} />
        )
      })}
    </>
  )

}

export default Ontologies;
