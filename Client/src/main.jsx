// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
const clientID = import.meta.env.VITE_APP_CLINT_ID

ReactDOM.createRoot(document.getElementById("root")).render(

  <GoogleOAuthProvider clientId={clientID}>
    <App />
  </GoogleOAuthProvider>

);
