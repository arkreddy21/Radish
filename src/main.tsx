import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./context";
import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppProvider>
        <App />
      </AppProvider>
    </MantineProvider>
  // </React.StrictMode>
);
