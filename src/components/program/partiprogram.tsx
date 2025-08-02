import React from "react";
import { partiprogram } from "../../data/program";
import { TableOfContents } from "./tableOfContents";
import { ProgramText } from "./programText";

export function Partiprogram() {
  return (
    <>
      <h1>Partiprogrammet</h1>
      <main>
        <section className={"contents"}>
          <TableOfContents sections={partiprogram} />
        </section>
        <section className={"text"}>
          <ProgramText sections={partiprogram} />
        </section>
      </main>
    </>
  );
}
