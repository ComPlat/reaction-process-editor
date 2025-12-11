import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Navbar,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
} from "reactstrap";
import { Link, useLocation } from "react-router-dom";

import UserMenu from "./UserMenu";

import { useReactionsFetcher } from "../../fetchers/ReactionsFetcher";

import OptionsQuickNavigator from "../utilities/OptionsQuickNavigator";

import { SelectOptions } from "../../contexts/SelectOptions";
import {
  SubFormController,
  SubFormToggle,
} from "../../contexts/SubFormController";

import OptionsDecorator from "../../decorators/OptionsDecorator";

const MainHeader = () => {
  const location = useLocation();
  const reactionApi = useReactionsFetcher();

  const [reactionOptions, setReactionOptions] = useState([]);
  const [sampleOptions, setSampleOptions] = useState([]);


  const [collectionOptions, setCollectionOptions] = useState([]);
  const [selectOptions, setSelectOptions] = useState([]);
  const [userDefaultConditions, setUserDefaultConditions] = useState([]);
  const [globalDefaultConditions, setGlobalDefaultConditions] = useState([]);

  const filterCollectionId = localStorage.getItem("filter_collection_id");
  const auth_token = new URLSearchParams(useLocation().search).get("auth");

  useEffect(() => {
    if (auth_token) {
      localStorage.setItem("bearer_auth_token", auth_token);
    }
    if (localStorage.getItem("bearer_auth_token")) {
      fetchCollectionOptions();
      fetchReactionAndSamplesOptions();
      fetchUserDefaultConditions();
    }
    window.addEventListener("indexRequiresReload", fetchReactionAndSamplesOptions);
    window.addEventListener(
      "userDefaultConditionsRequiresReload",
      fetchUserDefaultConditions
    );
    return () => {
      window.removeEventListener("indexRequiresReload", fetchReactionAndSamplesOptions);
      window.removeEventListener(
        "userDefaultConditionsRequiresReload",
        fetchUserDefaultConditions
      );
    };
    // eslint-disable-next-line
  }, [location, auth_token]);

  const fetchReactionAndSamplesOptions = () => {
    fetchReactionsOptions();
    fetchSamplesOptions();
  };

  const linkTarget = (model, id) => {
    if (['reactions', 'samples'].includes(model)) {
      return "/" + model + "/" + id
    }
  }

  const reactionsIndexPath = (model) => "/reactions"

  const fetchReactionsOptions = () => {
    let model = "reactions"
    reactionApi.indexOf(model).then((data) => {
      if (data && data[model]) {

        const options = data[model].map(({ id, short_label }) => ({
          key: id,
          path: linkTarget(model, id),
          label: id + ": " + short_label,
        }));
        setReactionOptions(options)
      }
    })

  };
  const fetchSamplesOptions = () => {
    let model = "samples"
    reactionApi.indexOf(model).then((data) => {
      if (data && data[model]) {
        console.log(data)

        const options = data[model].map(({ id, external_label }) => ({
          key: id,
          path: linkTarget(model, id),
          label: id + ": " + external_label,
        }));
        setSampleOptions(options);
      }
    })

  };

  const fetchCollectionOptions = () => {
    reactionApi.collectionSelectOptions().then((data) => {
      data?.collection_select_options &&
        setCollectionOptions(data["collection_select_options"]);
    });
  };

  const fetchUserDefaultConditions = () => {
    reactionApi.geDefaultConditions().then((data) => {
      let defaultConditions = data["default_conditions"];
      defaultConditions?.["global"] &&
        setGlobalDefaultConditions(defaultConditions["global"]);
      defaultConditions?.["user"] &&
        setUserDefaultConditions(defaultConditions["user"]);
      defaultConditions?.["select_options"] &&
        setSelectOptions(defaultConditions["select_options"]);
    });
  };

  const selectCollection = (event) => {
    localStorage.setItem("filter_collection_id", event.target.value);
    window.dispatchEvent(new Event("indexRequiresReload"));
  };

  const brandHref = () => {
    return localStorage.getItem("username") ? "/reactions" : "/";
  };

  return (
    <SelectOptions.Provider value={selectOptions}>
      <SubFormController.Provider value={SubFormToggle()}>
        <Navbar className="bg-secondary main-header" dark expand={true}>
          <NavbarBrand href={brandHref()} className="main-header__brand">
            <span className="main-header__brand-name">ELN Process Editor</span>
          </NavbarBrand>
          {localStorage.getItem("username") && (
            <>
              <Nav navbar className="me-auto main-header__nav">
                <UncontrolledDropdown nav>
                  <DropdownToggle nav caret>
                    {OptionsDecorator.valueToLabel(
                      filterCollectionId,
                      collectionOptions
                    ) || "Collections"}
                  </DropdownToggle>
                  <DropdownMenu>
                    {collectionOptions.map((collection) => (
                      <DropdownItem
                        key={collection.value}
                        value={collection.value}
                        onClick={selectCollection}
                      >
                        {collection.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav>
                  <DropdownToggle nav caret>
                    Reactions ({reactionOptions.length})
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      key={"reactions-index-link"}
                      tag={Link}
                      to={reactionsIndexPath()}
                    >
                      Reactions
                    </DropdownItem>
                    {reactionOptions.map((reaction) => (
                      <DropdownItem
                        key={reaction.key}
                        tag={Link}
                        to={reaction.path}
                      >
                        {reaction.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <OptionsQuickNavigator
                  label={'Samples'}
                  options={sampleOptions}
                />

              </Nav>
              <Nav navbar className="justify-content-end align-items-center">
                <UserMenu
                  defaultConditions={userDefaultConditions}
                  preconditions={globalDefaultConditions}
                />
              </Nav>
            </>
          )}
        </Navbar>
      </SubFormController.Provider>
    </SelectOptions.Provider>
  );
};

export default MainHeader;
