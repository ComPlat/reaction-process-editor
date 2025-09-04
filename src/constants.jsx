// import { chemotionElnHostname } from "./config";
// Set chemotionElnHostname to the running instance of your ELN server.
export const apiHostname = 'https://cb-eln-reaction-process-editor.deploy.chemdev.scc.kit.edu/';
export const apiBasePath = `${apiHostname}/api/v1/reaction_process_editor`;

export const afterSignInPath = "/reactions";
export const afterSignOutPath = "/";

export const generalErrorRedirectPath = afterSignInPath;
export const unauthorizedRedirectPath = afterSignOutPath;

export const messageCloseTime = { info: 3500, error: 6000 }
