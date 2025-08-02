import React from "react";
import { TableOfContents } from "./tableOfContents";
import { ProgramText } from "./programText";
import { Header } from "./programHeader";
import { appDocument } from "../../data/document";

export function Partiprogram() {
  return (
    <>
      <Header doc={appDocument} />
      <main>
        <section className={"contents"}>
          <TableOfContents doc={appDocument} />
        </section>
        <section className={"text"}>
          <ProgramText doc={appDocument} />
        </section>
      </main>
    </>
  );
}
