import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import NotificationContext from "../contexts/NotificationContext";

import { apiBasePath, afterSignOutPath } from "../constants";

import { notifications } from "../constants/translations";

export { useRequestWrapper };

function useRequestWrapper() {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  return { request };

  function authorizationHeader() {
    return localStorage.bearer_auth_token
      ? { Authorization: `Bearer ${localStorage.bearer_auth_token}` }
      : {};
  }

  function request(method, path, body) {
    method === "GET" || window.dispatchEvent(new Event("indicateSave"));

    const requestOptions = {
      method,
      headers: authorizationHeader(),
    };
    requestOptions.headers["Accept"] = "application/json";
    requestOptions.headers["Content-Type"] = "application/json";
    requestOptions.headers["Access-Control-Allow-Origin"] = "*";

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }
    return fetch(apiBasePath + path, requestOptions).catch(() => {
      return handleRequestFailure();
    });
  }

  function handleRequestFailure() {
    localStorage.removeItem("username");
    localStorage.removeItem("bearer_auth_token");
    addNotification(notifications.network.error.server_not_reachable);
    navigate(afterSignOutPath);
    return;
  }
}
