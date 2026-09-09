/**
 * frontend/src/pages/Page2.jsx
 */

import React from "react";
import { Link } from "react-router-dom";

export const Page2 = (props) => {
  return (
    <main>
      <h1>This is Page 2</h1>
      <Link to="/page1"   draggable="false">Page 1</Link>
      <Link to="/records" draggable="false">Records</Link>
      <Link to="/chat"    draggable="false">Chat</Link>
    </main>
  );
};
