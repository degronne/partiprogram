import React from "react";
import { partiprogram } from "../../data/program";
import { TableOfContents } from "./tableOfContents";
import { ProgramText } from "./programText";
import { Header } from "./programHeader";

export function Partiprogram() {
  return (
    <>
      <Header sections={partiprogram} />
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
