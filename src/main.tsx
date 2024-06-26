import * as React from "react";
import ReactDOM from "react-dom"; // Import ReactDOM from the correct location

import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

const container = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);