import React from "react";
import { Partiprogram } from "../program/partiprogram";
import { HashRouter } from "react-router-dom";

export function Application() {
  return (
    <HashRouter>
      <Partiprogram />
    </HashRouter>
  );
}
