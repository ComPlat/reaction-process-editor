import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import NotificationContext from "../contexts/NotificationContext";
import { useRequestWrapper } from "./requestWrapper";
import { afterSignInPath, afterSignOutPath } from "../constants";

export { useAuthenticationFetcher };

function useAuthenticationFetcher() {
  const requestWrapper = useRequestWrapper();
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  return {
    signIn,
    signOut,
  };

  function signIn(credentials) {
    let body = {
      user: { login: credentials.username, password: credentials.password },
    };

    requestWrapper.request("POST", `/sign_in`, body).then((response) => {
      if (response) {
        switch (response.status) {
          case 200:
            let token = response.headers
              .get("Authorization")
              .split("Bearer ")[1];
            createSession(credentials.username, token);
            addNotification({
              title: "Success",
              message: "Logged in as " + credentials.username + ".",
              type: "success",
            });
            return;
          case 401:
            addNotification({
              title: "Username or Password wrong.",
              message: "Please check your spelling.",
              type: "warning",
            });
            destroySession();
            return;
          default:
            addNotification({
              title: "Unknown Error" + (response ? ": " + response.status : ""),
              message: response ? response.statusText : "",
              type: "error",
            });
            destroySession();
            return;
        }
      }
    });
  }

  function signOut() {
    return requestWrapper.request("DELETE", "/sign_out").then(() => {
      destroySession();
    });
  }

  function createSession(username, token) {
    localStorage.setItem("username", username);
    localStorage.setItem("bearer_auth_token", token);
    navigate(afterSignInPath);
  }

  function destroySession() {
    localStorage.removeItem("username");
    localStorage.removeItem("bearer_auth_token");
    navigate(afterSignOutPath);
  }
}
