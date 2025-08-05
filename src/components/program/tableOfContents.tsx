import React from "react";
import { Link } from "react-router-dom";
import { DocChapter, DocDocument } from "../../data/document";
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
            <TableOfContentChapter key={chapter.chapterId} chapter={chapter} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function TableOfContentChapter({ chapter }: { chapter: DocChapter }) {
  const { matchesInclude, setShowTableOfContent } = useSearchContext();
  if (!matchesInclude(chapter)) return null;
  const { chapterId, text, children } = chapter;

  function onCloseMenu() {
    setShowTableOfContent(false);
  }

  return (
    <li key={chapterId}>
      <Link to={`/seksjon/${chapterId}`} onClick={onCloseMenu}>
        {chapterId} {text}
      </Link>
      <SearchMatches fragment={chapter} />
      <ul>
        {children.filter(matchesInclude).map((child) => {
          if (child.type !== "section") return null;
          const { chapterId, sectionId, text } = child;
          return (
            <li key={sectionId}>
              <Link
                to={`/seksjon/${chapterId}/${sectionId}`}
                onClick={onCloseMenu}
              >
                {sectionId} {text}
              </Link>
              <SearchMatches fragment={child} />
            </li>
          );
        })}
      </ul>
    </li>
  );
}
