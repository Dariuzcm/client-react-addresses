import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CodigoPostalProvider } from "./Provider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CodigoPostalProvider>
      <App />
      <Toaster />
    </CodigoPostalProvider>
  </React.StrictMode>
);
