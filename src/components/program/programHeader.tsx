import { Link, Route, Routes, useParams } from "react-router-dom";
import React from "react";
import { DocDocument } from "../../data/document";
import { ProgramSearch } from "./programSearch";

function SectionHeader({ doc }: { doc: DocDocument }) {
  const { chapterId, anchorId } = useParams();
  const targetId = anchorId ? anchorId.split("-")[0] : undefined;
  const chapter = doc.chapters.find((s) => s.chapterId == chapterId);
  const section = targetId
    ? chapter?.children.find((s) => s.anchor == targetId)
    : undefined;
  return (
    <>
      <Link to={`/seksjon/${chapter?.chapterId}`}>
        {chapter?.chapterId} {chapter?.text}
      </Link>{" "}
      {section && (
        <span className={"sectionHeader"}>
          &gt; {section.sectionId} {section?.text}
        </span>
      )}
    </>
  );
}

export function Header({ doc }: { doc: DocDocument }) {
  return (
    <header>
      <a className={"icon"} href={"https://mdg.no"}>
        <img src={"/site-icon.png"} alt={"MDG"} />
      </a>
      <Routes>
        <Route
          path={"/seksjon/:chapterId/:anchorId?"}
          element={<SectionHeader doc={doc} />}
        />
        <Route path={"*"} element={<h1>Partiprogram</h1>} />
      </Routes>
      <span style={{ flex: 1 }} />
      <ProgramSearch />
    </header>
  );
}
