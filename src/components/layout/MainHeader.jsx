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
  // const [sampleOptions, setSampleOptions] = useState([]);
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
      fetchReactionOptions();
      fetchUserDefaultConditions();
    }
    window.addEventListener("indexRequiresReload", fetchReactionOptions);
    window.addEventListener(
      "userDefaultConditionsRequiresReload",
      fetchUserDefaultConditions
    );
    return () => {
      window.removeEventListener("indexRequiresReload", fetchReactionOptions);
      window.removeEventListener(
        "userDefaultConditionsRequiresReload",
        fetchUserDefaultConditions
      );
    };

    // React's state model requires `fetchReactionOptions` in the dependencies array to assert state consistency.
    // When done however it will be called every time when dependencies are checked (i.e. after refetch),
    // triggering another refetch (endless loop).
    // Wrapping fetchReactionOptions in a useCallback as recommended by the React guidelines
    // does not work either as it depends on the api = useReactionsFetcher(),
    // which then again can not be used in hooks as useReactionsFetcher() is a hook itself.
    //
    // We ignore the warnings which is recommended only when you know exactly what you are doing which I do not. cbuggle.
    // eslint-disable-next-line
  }, [location, auth_token]);

  // Hardcoded routes are ok for now.
  const reactionLinkTarget = (id) => {
    return "/reactions/" + id;
  };

  const sampleLinkTarget = (id) => {
    return "/samples/" + id;
  };

  const reactionIndexLinkTarget = "/reactions";

  const fetchReactionOptions = () => {
    reactionApi.index().then((data) => {
      if (data && data["reactions"]) {
        // setReactions(data["reactions"]);
        const options = data["reactions"].map(({ id, short_label }) => ({
          key: id,
          url: reactionLinkTarget(id),
          label: id + ": " + short_label,
        }));
        options.unshift({
          key: "index",
          url: reactionIndexLinkTarget,
          label: "Reaction Index",
        });
        setReactionOptions(options);
      }
    });
  };

  const fetchCollectionOptions = () => {
    reactionApi.collectionSelectOptions().then((data) => {
      data?.collection_select_options &&
        setCollectionOptions(data["collection_select_options"]);
    });
  };

  // const fetchSampleOptions = () => {
  //   reactionApi.sampleSelectOptions().then((data) => {
  //     data?.sample_select_options &&
  //       setSampleOptions(data["sample_select_options"]);
  //   });
  // };

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

  const sampleOptions = selectOptions.samples?.map(({ id, label }) => ({
    key: id,
    url: sampleLinkTarget(id),
    label: id + ": " + label,
  })) || [];

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
                    {reactionOptions.map((reaction) => (
                      <DropdownItem
                        key={reaction.key}
                        tag={Link}
                        to={reaction.url}
                      >
                        {reaction.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav>
                  <DropdownToggle nav caret>
                    Samples ({sampleOptions.length})
                  </DropdownToggle>
                  <DropdownMenu>
                    {sampleOptions.map((reaction) => (
                      <DropdownItem
                        key={reaction.key}
                        tag={Link}
                        to={reaction.url}
                      >
                        {reaction.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
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
