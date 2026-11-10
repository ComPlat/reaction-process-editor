# reaction-process-editor
A frontend UI for editing reaction processes of reactions stored in the ELN (Electronic Laboratory Notebook) ELN run by KIT-IOC (Karlsruher Institut für Technologie, Institut für Organische Chemie).

## Installation

Copy `.env.example` to `.env` in the project root:

```sh
cp .env.example .env
```

The app requires a running Chemotion ELN instance as its backend. Set
`REACT_APP_CHEMOTION_ELN_HOSTNAME` to that instance's origin, without a
trailing slash.

Run `yarn start` in the root directory. Restart the development server after
changing `.env` so the updated value is loaded.

Login with your ELN credentials.
