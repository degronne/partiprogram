import React from "react";
import { TableOfContents } from "./tableOfContents";
import { ProgramText } from "./programText";
import { Header } from "./programHeader";
import { appDocument } from "../../data/document";
import { SearchContextProvider } from "../search/searchContext";

export function Partiprogram() {
  return (
    <SearchContextProvider>
      <Header doc={appDocument} />
      <main>
        <section className={"contents"}>
          <TableOfContents doc={appDocument} />
        </section>
        <section className={"text"}>
          <div className={"text-area"}>
            <ProgramText doc={appDocument} />
          </div>
        </section>
      </main>
    </SearchContextProvider>
  );
}
