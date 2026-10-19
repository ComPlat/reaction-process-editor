import fs from "fs";
import path from "path";

import { act } from "react";
import { createRoot } from "react-dom/client";
import { waitFor } from "@testing-library/react";

import NotificationContext from "../../contexts/NotificationContext";
import { useReactionsFetcher } from "../../fetchers/ReactionsFetcher";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

jest.mock("../../constants", () => ({
  apiHostname: "http://localhost:3000",
  apiBasePath: "http://localhost:3000/api/v1/reaction_process_editor",
  afterSignOutPath: "/",
  generalErrorRedirectPath: "/reactions",
  unauthorizedRedirectPath: "/"
}));

const fixturePath = path.resolve(process.cwd(), "src/__tests__/fixtures/reactions.json");
const reactionsFixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

const responseFromFixture = () => ({
  ok: reactionsFixture.response.ok,
  status: reactionsFixture.response.status,
  statusText: reactionsFixture.response.statusText,
  text: () => Promise.resolve(reactionsFixture.response.body)
});

const ReactionsIndexHarness = ({ onData }) => {
  const reactionsFetcher = useReactionsFetcher();

  return (
    <button type="button" onClick={() => reactionsFetcher.index().then(onData)}>
      Fetch reactions
    </button>
  );
};

const ClapUploadHarness = ({ onData, reactionProcessId }) => {
  const reactionsFetcher = useReactionsFetcher();

  return (
    <button type="button" onClick={() => reactionsFetcher.uploadClap(reactionProcessId).then(onData)}>
      Upload CLAP
    </button>
  );
};

const renderHarness = ({ onData = jest.fn(), addNotification = jest.fn() } = {}) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <NotificationContext.Provider value={{ addNotification }}>
        <ReactionsIndexHarness onData={onData} />
      </NotificationContext.Provider>
    );
  });

  return {
    addNotification,
    onData,
    button: container.querySelector("button"),
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    }
  };
};

const renderClapUploadHarness = ({ reactionProcessId, onData = jest.fn(), addNotification = jest.fn() }) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <NotificationContext.Provider value={{ addNotification }}>
        <ClapUploadHarness reactionProcessId={reactionProcessId} onData={onData} />
      </NotificationContext.Provider>
    );
  });

  return {
    addNotification,
    onData,
    button: container.querySelector("button"),
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    }
  };
};

describe("useReactionsFetcher index", () => {
  let mountedComponents;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("bearer_auth_token", "fixture-token");
    global.fetch = jest.fn().mockResolvedValue(responseFromFixture());
    mountedComponents = [];
  });

  afterEach(() => {
    mountedComponents.forEach((component) => component.unmount());
  });

  test("fetches the reactions index with bearer auth and returns fixture data", async () => {
    const component = renderHarness();
    mountedComponents.push(component);

    await act(async () => component.button.click());

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/v1/reaction_process_editor/reactions",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer fixture-token",
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
    expect(component.onData).toHaveBeenCalledWith(reactionsFixture.response.json);
    expect(component.onData.mock.calls[0][0].reactions).toHaveLength(8);
  });
});

describe("useReactionsFetcher CLAP upload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("bearer_auth_token", "fixture-token");
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 201,
      statusText: "Created",
      text: () => Promise.resolve(JSON.stringify({ uploaded: true, upstream_status: 201 }))
    });
  });

  test("posts to the reaction process CLAP upload endpoint", async () => {
    const component = renderClapUploadHarness({ reactionProcessId: "reaction-2" });

    await act(async () => component.button.click());

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/v1/reaction_process_editor/reaction_processes/reaction-2/clap/upload",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer fixture-token",
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    ));
    expect(component.onData).toHaveBeenCalledWith({ uploaded: true, upstream_status: 201 });

    component.unmount();
  });

  test("displays the CLAP upload response message when the upload fails", async () => {
    const component = renderClapUploadHarness({ reactionProcessId: "reaction-2" });
    global.fetch.mockResolvedValue({
      ok: false,
      status: 502,
      statusText: "Bad Gateway",
      text: () => Promise.resolve(JSON.stringify({ message: "Laboratory endpoint rejected the upload." }))
    });

    await act(async () => component.button.click());

    await waitFor(() => expect(component.addNotification).toHaveBeenCalledWith({
      title: "Error 502",
      message: "Laboratory endpoint rejected the upload.",
      type: "error"
    }));

    component.unmount();
  });
});
