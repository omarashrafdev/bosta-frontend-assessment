import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "./store";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ChakraProvider>
      <React.StrictMode>
        <I18nextProvider i18n={i18n}>
          <Router>
            <App />
          </Router>
        </I18nextProvider>
      </React.StrictMode>
    </ChakraProvider>
  </Provider>
);
