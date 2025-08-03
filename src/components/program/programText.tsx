import React, { useEffect, useRef } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import {
  DocChapter,
  DocDocument,
  DocHeadline,
  DocListHeader,
  DocNumberedItem,
  DocParagraph,
  DocSection,
} from "../../data/document";
import { SearchMatchView } from "../search/searchMatchView";

export function ProgramText({ doc }: { doc: DocDocument }) {
  return (
    <Routes>
      <Route
        path={"/seksjon/:chapterId"}
        element={<SingleChapter doc={doc} />}
      />
      <Route
        path={"/seksjon/:chapterId/:sectionId"}
        element={<SingleChapter doc={doc} />}
      />
      <Route path={"*"} element={<AllChapters doc={doc} />} />
    </Routes>
  );
}

function SingleChapter({ doc }: { doc: DocDocument }) {
  const { chapterId, sectionId } = useParams();

  const chapter = doc.chapters.find((s) => s.chapterId == chapterId);
  if (chapter) {
    return <ProgramChapter chapter={chapter} sectionId={sectionId} />;
  }

  return (
    <h1>
      {chapterId} del: {sectionId}
    </h1>
  );
}

export function AllChapters({ doc }: { doc: DocDocument }) {
  return (
    <>
      {doc.chapters.map((s) => (
        <ProgramChapter key={s.chapterId} chapter={s} />
      ))}
    </>
  );
}

export function ProgramChapter({
  chapter: { chapterId, text, children },
  sectionId,
}: {
  chapter: DocChapter;
  sectionId?: string;
}) {
  const ref = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    if (sectionId === sectionId)
      ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [sectionId]);
  return (
    <section className={"chapter"}>
      <h2>
        {chapterId} {text}
      </h2>
      {children.map((c, index) => (
        <ProgramChapterChild key={index} fragment={c} sectionId={sectionId} />
      ))}
    </section>
  );
}

function ProgramSectionChild({
  fragment,
}: {
  fragment: DocNumberedItem | DocHeadline | DocParagraph | DocListHeader;
}) {
  const { type, text } = fragment;
  if (type === "numberedItem")
    return (
      <li>
        {fragment.itemId}. <SearchMatchView fragment={fragment} />
      </li>
    );
  if (type === "headline" || type == "proposalsStart") return <h3>{text}</h3>;
  if (type === "paragraph" || type == "listHeader") return <p>{text}</p>;
  return "missing handler for " + type;
}

function ProgramSection({
  sectionId,
  section,
}: {
  sectionId: string | undefined;
  section: DocSection;
}) {
  const { text, children } = section;
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (section.sectionId === sectionId)
      ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [sectionId]);

  return (
    <div className={"section"} ref={ref}>
      <h3>
        {sectionId} {text}
      </h3>
      {children.map((c, index) => (
        <ProgramSectionChild key={index} fragment={c} />
      ))}
    </div>
  );
}

function ProgramChapterChild({
  fragment,
  sectionId,
}: {
  fragment: DocSection | DocParagraph | DocHeadline;
  sectionId?: string;
}) {
  const { type, text } = fragment;
  if (type === "section")
    return <ProgramSection sectionId={sectionId} section={fragment} />;
  if (type === "headline" || type == "proposalsStart") return <h3>{text}</h3>;
  return <p>{text}</p>;
}
