import { Route, Routes, useParams } from "react-router-dom";
import React from "react";
import { DocDocument } from "../../data/document";

function SectionHeader({ doc }: { doc: DocDocument }) {
  const { chapterId, sectionId } = useParams();
  const chapter = doc.chapters.find((s) => s.chapterId == chapterId);
  const section = sectionId
    ? chapter?.children.find((s) => s.sectionId == sectionId)
    : undefined;
  return (
    <h1>
      Program &gt; {chapter?.chapterId} {chapter?.text}
      {sectionId && (
        <span>
          &gt; {sectionId} {section?.text}
        </span>
      )}
    </h1>
  );
}

export function Header({ doc }: { doc: DocDocument }) {
  return (
    <header>
      <Routes>
        <Route
          path={"/seksjon/:chapterId/:sectionId?"}
          element={<SectionHeader doc={doc} />}
        />
        <Route path={"*"} element={<h1>MDG partiprogram</h1>} />
      </Routes>
    </header>
  );
}
