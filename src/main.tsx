import React from "react";
import { createRoot } from "react-dom/client";
import { Application } from "./components/app/application.js";

import "./application.css";

createRoot(document.getElementById("app")!).render(<Application />);
