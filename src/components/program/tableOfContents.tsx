import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { ProgramSearch } from "./programSearch";
import {
  DocChapter,
  DocDocument,
  DocDocumentFragment,
  DocHeadline,
  DocParagraph,
  DocSection,
} from "../../data/document";
import { SearchMatch } from "../../data/search";

function SearchMatch({
  fragment,
  match,
}: {
  fragment: DocDocumentFragment;
  match: SearchMatch[];
}) {
  const { text } = fragment;

  const boundaries = match.toSorted((a, b) => a.start - b.start);
  const fragments: ReactNode[] = [];
  let curr = 0;
  for (const { start, end } of boundaries) {
    fragments.push(<span>{text.substring(curr, start)}</span>);
    fragments.push(<u>{text.substring(start, end)}</u>);
    curr = end;
  }
  fragments.push(<span>{text.substring(curr)}</span>);

  return <li>{fragments}</li>;
}

function ChapterChild({
  fragment,
  matches,
}: {
  fragment: DocSection | DocParagraph | DocHeadline;
  matches: Map<DocDocumentFragment, SearchMatch[]>;
}) {
  if (fragment.type === "section") {
    const { chapterId, sectionId, text } = fragment;
    const sectionMatches = [...matches.keys()].filter(
      (match) =>
        match.sectionId === sectionId &&
        (match.type === "paragraph" || match.type === "numberedItem"),
    );
    return (
      <li key={sectionId}>
        <Link to={`/seksjon/${chapterId}/${sectionId}`}>
          {sectionId} {text}
        </Link>
        <ul>
          {sectionMatches.map((s) => (
            <SearchMatch fragment={s} match={matches.get(s)!} />
          ))}
        </ul>
      </li>
    );
  }
  return null;
}

function TableOfContentChapter({
  chapter,
  itemMatchesSearch,
  matches,
}: {
  chapter: DocChapter;
  itemMatchesSearch: (fragment: DocDocumentFragment) => boolean;
  matches: Map<DocDocumentFragment, SearchMatch[]>;
}) {
  if (!itemMatchesSearch(chapter)) return null;
  const { chapterId, text, children } = chapter;
  const localMatches = [...matches.keys()].filter(
    (match) =>
      match.sectionId === undefined &&
      match.chapterId === chapterId &&
      (match.type === "paragraph" || match.type === "numberedItem"),
  );
  return (
    <li key={chapterId}>
      <Link to={`/section/${chapterId}`}>
        {chapterId} {text}
      </Link>
      <ul>
        {localMatches.map((c) => (
          <SearchMatch fragment={c} match={matches.get(c)!} />
        ))}
        {children
          .filter((c) => itemMatchesSearch(c))
          .map((child) => (
            <ChapterChild
              key={child.sectionId}
              fragment={child}
              matches={matches}
            />
          ))}
      </ul>
    </li>
  );
}

export function TableOfContents({ doc }: { doc: DocDocument }) {
  const [matches, setMatches] = useState<
    Map<DocDocumentFragment, SearchMatch[]>
  >(new Map());

  function itemMatchesSearch(fragment: DocDocumentFragment) {
    if (!matches.size) return true;

    if ("sectionId" in fragment) {
      return [...matches.keys()].some(
        (m) => "sectionId" in m && m.sectionId === fragment.sectionId,
      );
    }

    return [...matches.keys()].some((m) => m.chapterId === fragment.chapterId);
  }

  return (
    <>
      <ProgramSearch setMatches={setMatches} matches={matches} />
      <div className={"items"}>
        <ul>
          {doc.chapters.map((chapter) => (
            <TableOfContentChapter
              key={chapter.chapterId}
              chapter={chapter}
              matches={matches}
              itemMatchesSearch={itemMatchesSearch}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
