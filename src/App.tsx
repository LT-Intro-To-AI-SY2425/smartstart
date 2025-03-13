import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ChatContainer } from "./pages/chat/ChatContainer";
import AboutPage from "./pages/about/AboutPage";
import '@fontsource-variable/inter';

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<AboutPage />} />
        <Route path="/chat" element={<ChatContainer />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
}
