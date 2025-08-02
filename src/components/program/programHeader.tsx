import { Route, Routes, useParams } from "react-router-dom";
import React from "react";
import { SectionNode } from "../../data/program";

function SectionHeader({ sections }: { sections: SectionNode[] }) {
  const { chapterId, sectionId } = useParams();
  const chapter = sections.find((s) => s.number == chapterId);
  const section = chapter?.children.find(
    (s) => "number" in s && s.number == sectionId,
  );
  return (
    <h1>
      Program &gt; {chapter?.title || chapter?.number} &gt; {sectionId}{" "}
      {section && "title" in section && section?.title}
    </h1>
  );
}

export function Header({ sections }: { sections: SectionNode[] }) {
  return (
    <header>
      <Routes>
        <Route
          path={"/seksjon/:chapterId/:sectionId"}
          element={<SectionHeader sections={sections} />}
        />
        <Route path={"*"} element={<h1>MDG partiprogram</h1>} />
      </Routes>
    </header>
  );
}
