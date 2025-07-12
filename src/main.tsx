import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import TradingChart from "./TradingChart";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <TradingChart />
  </React.StrictMode>
);
