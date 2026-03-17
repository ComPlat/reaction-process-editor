// import { chemotionElnHostname } from "./config";
// Set chemotionElnHostname to the running instance of your ELN server.
export const apiHostname = process.env.REACT_APP_CHEMOTION_ELN_HOSTNAME;
export const apiBasePath = `${apiHostname}/api/v1/reaction_process_editor`;

export const afterSignInPath = "/reactions";
export const afterSignOutPath = "/";

export const generalErrorRedirectPath = afterSignInPath;
export const unauthorizedRedirectPath = afterSignOutPath;

export const defaultlMessageCloseTime = { info: 3500, warning: 4000, error: 6000 }
