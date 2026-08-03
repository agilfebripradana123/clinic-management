import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import "goey-toast/styles.css";
import { GooeyToaster } from "goey-toast";

import AuthProvider from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <GooeyToaster position="bottom-right" />
    </AuthProvider>
  </React.StrictMode>,
);