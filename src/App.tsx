import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ChatContainer } from "./pages/chat/ChatContainer";

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
        <Route index element={<ChatContainer />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
}
