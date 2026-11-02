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
    return (
      path,
      body,
      {
        redirectOnError = true,
        reloadOnSuccess = true,
        showSaveIndicator = true,
        successNotification
      } = {}
    ) => {
      return requestWrapper
        .request(method, path, body, { showSaveIndicator })
        .then(handleResponse({
          method,
          redirectOnError,
          reloadOnSuccess,
          showSaveIndicator,
          successNotification
        }))
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

  function handleResponse({
    method,
    redirectOnError,
    reloadOnSuccess,
    showSaveIndicator,
    successNotification
  }) {
    return function (response) {
      if (response) {
        return response.text().then((text) => {
          let data;
          try {
            data = text && JSON.parse(text);
          } catch (_error) {
            data = text;
          }

          if (response.ok) {
            successNotification && addNotification(successNotification);
            if (method !== "GET" && reloadOnSuccess) {
              window.dispatchEvent(new Event("requireReload"));
            } else if (method !== "GET" && showSaveIndicator) {
              window.dispatchEvent(new Event("reloadDone"));
            }
            return data;
          } else {
            let errorMessage = data?.message
              || (typeof data === "string" && data)
              || response.statusText
              || "Unknown Error";
            addNotification({
              title: "Error " + response.status,
              message: errorMessage,
              type: "error",
            });
            if ([401, 403].includes(response.status)) {
              signoutAndRedirect();
            } else if (redirectOnError) {
              redirectOnGeneralError();
            } else if (showSaveIndicator) {
              window.dispatchEvent(new Event("reloadDone"));
            }
            return {};
          }
        });
      } else {
        return {};
      }
    };
  }
}
