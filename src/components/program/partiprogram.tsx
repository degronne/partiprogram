import React from "react";
import { TableOfContents } from "./tableOfContents";
import { ProgramText } from "./programText";
import { Header } from "./programHeader";
import { appDocument } from "../../data/document";
import { SearchContextProvider } from "../search/searchContext";
import { ShowTableOfContentsButton } from "./showTableOfContentsButton";

export function Partiprogram() {
  return (
    <SearchContextProvider>
      <Header doc={appDocument} />
      <main>
        <ShowTableOfContentsButton />
        <TableOfContents doc={appDocument} />
        <section className={"documentText"}>
          <div className={"textContent"}>
            <ProgramText doc={appDocument} />
          </div>
        </section>
      </main>
    </SearchContextProvider>
  );
}
