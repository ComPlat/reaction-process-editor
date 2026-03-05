import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import NotificationContext from "../contexts/NotificationContext";
import { useRequestWrapper } from "./requestWrapper";
import {
  unauthorizedRedirectPath,
  generalErrorRedirectPath,
} from "../constants";

export { useElnApi };

function useElnApi() {
  const navigate = useNavigate();
  const requestWrapper = useRequestWrapper();
  const { addNotification } = useContext(NotificationContext);

  return {
    get: request("GET"),
    post: request("POST"),
    put: request("PUT"),
    delete: request("DELETE"),
    download,
  };

  function signoutAndRedirect() {
    localStorage.removeItem("username");
    localStorage.removeItem("bearer_auth_token");
    navigate(unauthorizedRedirectPath);
  }

  function redirectOnGeneralError() {
    navigate(generalErrorRedirectPath);
  }

  function request(method) {
    return (path, body) => {
      method === "GET" || window.dispatchEvent(new Event("indicateSave"));
      return requestWrapper
        .request(method, path, body)
        .then(handleResponse(method))
        .catch();
    };
  }

  function download(path) {
    return requestWrapper.request("GET", path).then((response) => {
      if (response?.ok) {
        return response
      } else {
        let data = response?.text();
        let errorMessage = (data && data.message) || response?.statusText || "Download Error";
        addNotification({
          title: "Error " + response?.status,
          message: errorMessage,
          type: "error",
        });
        [401, 403].includes(response?.status) && signoutAndRedirect()
      }
    });
  }

  function handleResponse(method) {
    return function (response) {
      if (response) {
        return response.text().then((text) => {
          if (response.ok) {
            let data = text && JSON.parse(text);
            method === "GET" ||
              window.dispatchEvent(new Event("requireReload"));
            return data;
          } else {
            let data = text;
            let errorMessage = (data && data.message) || response.statusText || "Unknown Error";
            addNotification({
              title: "Error " + response.status,
              message: errorMessage,
              type: "error",
            });
            [401, 403].includes(response.status)
              ? signoutAndRedirect()
              : redirectOnGeneralError();
            return {};
          }
        });
      } else {
        return {};
      }
    };
  }
}
