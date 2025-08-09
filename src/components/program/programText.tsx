import React, { useEffect, useRef } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import {
  DocChapter,
  DocDocument,
  DocDocumentFragment,
} from "../../data/document";
import { SearchMatchView } from "../search/searchMatchView";
import { ShareButton } from "../ui/shareButton";

export function ProgramText({ doc }: { doc: DocDocument }) {
  return (
    <Routes>
      <Route
        path={"/seksjon/:chapterId/:targetId?"}
        element={<SingleChapter doc={doc} />}
      />
      <Route path={"*"} element={<AllChapters doc={doc} />} />
    </Routes>
  );
}

function SingleChapter({ doc }: { doc: DocDocument }) {
  const { chapterId, targetId } = useParams();

  const chapter = doc.chapters.find((s) => s.chapterId == chapterId);
  if (chapter) {
    return (
      <ProgramChapter
        chapter={chapter}
        chapterId={chapterId}
        targetId={targetId}
      />
    );
  }

  return (
    <h1>
      {chapterId} del: {targetId}
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
  chapter,
  chapterId,
  targetId,
}: {
  chapter: DocChapter;
  chapterId?: string;
  targetId?: string;
}) {
  const ref = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    if (chapter.chapterId === chapterId && !targetId)
      ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [targetId]);
  const { text, children } = chapter;
  return (
    <section className={"chapter"} ref={ref}>
      <h2>
        {chapter.chapterId} {text} <ShareButton to={`/seksjon/${chapterId}`} />
      </h2>
      {children.map((c, index) => (
        <DocumentFragmentView key={index} fragment={c} targetId={targetId} />
      ))}
    </section>
  );
}

function DocumentFragmentView({
  fragment,
  targetId,
}: {
  fragment: DocDocumentFragment;
  targetId?: string;
}) {
  const ref = useRef<any | null>(null);
  const { type, anchor, text, chapterId } = fragment;
  useEffect(() => {
    if (anchor === targetId)
      ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [targetId]);

  if (type === "section") {
    const { chapterId, children, sectionId, anchor } = fragment;
    return (
      <div className={"section"} ref={ref}>
        <h3>
          {sectionId} {text}{" "}
          <ShareButton to={`/seksjon/${chapterId}/${anchor}`} />
        </h3>
        {children.map((c, index) => (
          <DocumentFragmentView key={index} fragment={c} targetId={targetId} />
        ))}
      </div>
    );
  } else if (type === "headline" || type === "proposalsStart") {
    return <h3>{text}</h3>;
  } else if (type === "numberedItem") {
    return (
      <li ref={ref}>
        {fragment.itemId}. <SearchMatchView fragment={fragment} />{" "}
        <ShareButton to={`/seksjon/${chapterId}/${anchor}`} />
      </li>
    );
  } else if (type === "paragraph" || type === "listHeader") {
    return (
      <p>
        <SearchMatchView fragment={fragment} />
      </p>
    );
  } else {
    const unhandled = fragment;
    return JSON.stringify({ unhandled });
  }
}
