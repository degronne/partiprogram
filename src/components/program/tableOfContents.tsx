import React from "react";
import { Link } from "react-router-dom";
import {
  DocChapter,
  DocDocument,
  DocDocumentFragment,
  DocSection,
} from "../../data/document";
import { useSearchContext } from "../search/searchContext";
import { SearchMatches } from "../search/searchMatches";
import clsx from "clsx";

export function TableOfContents({ doc }: { doc: DocDocument }) {
  const { showTableOfContent } = useSearchContext();
  return (
    <section className={clsx("tableOfContent", { showTableOfContent })}>
      <div className={"items"}>
        <ul>
          {doc.chapters.map((chapter) => (
            <TableOfContentFragment
              key={chapter.chapterId}
              fragment={chapter}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function fragmentLink(fragment: DocChapter | DocSection) {
  const { chapterId, sectionId } = fragment;
  return sectionId
    ? `/seksjon/${chapterId}/${sectionId}`
    : `/seksjon/${chapterId}`;
}

function TableOfContentFragment({
  fragment,
}: {
  fragment: DocChapter | DocDocumentFragment;
}) {
  const { matchesInclude, setShowTableOfContent } = useSearchContext();
  function onCloseMenu() {
    setShowTableOfContent(false);
  }

  const { chapterId, sectionId, text, type } = fragment;
  if (type !== "chapter" && type !== "section") return null;
  if (!matchesInclude(fragment)) return null;

  const title =
    type === "chapter" ? (
      <>
        {chapterId} {text}
      </>
    ) : (
      <>
        {sectionId} {text}
      </>
    );
  return (
    <li>
      <Link to={fragmentLink(fragment)} onClick={onCloseMenu}>
        {title}
      </Link>
      <SearchMatches fragment={fragment} />
      <ul>
        {fragment.children.map((child) => (
          <TableOfContentFragment fragment={child} key={child.anchor} />
        ))}
      </ul>
    </li>
  );
}
