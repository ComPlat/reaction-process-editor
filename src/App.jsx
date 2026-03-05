import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GlobalNotification from "./components/layout/GlobalNotification";
import Login from "./components/views/Login";
import MainHeader from "./components/layout/MainHeader";
import Ontologies from "./components/views/Ontologies";
import ReactionIndex from "./components/views/ReactionIndex";
import ReactionProcess from "./components/views/ReactionProcess";
import SampleProcess from "./components/views/SampleProcess";

import NotificationContext from "./contexts/NotificationContext";

import "./css/chemotion_theme.scss";

const App = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
  };
  return (
    <BrowserRouter className="App">
      <NotificationContext.Provider value={{ notifications, addNotification }}>
        <GlobalNotification />
        <MainHeader />
        <Routes>
          <Route path="/" exact={true} element={<Login />} />
          <Route path="/reactions" exact={true} element={<ReactionIndex />} />
          <Route path="/reactions/:reactionId" element={<ReactionProcess />} />
          <Route path="/ontologies" element={<Ontologies />} />
          <Route path="/samples/:sampleId" element={<SampleProcess />} />
        </Routes>
      </NotificationContext.Provider>
    </BrowserRouter>
  );
};

export default App;
