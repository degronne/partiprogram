import { ContentItem, SectionNode, Words } from "../../data/program";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ProgramSearch } from "./programSearch";
import { FuseResult } from "fuse.js";

function TableOfContentSubsections({
  section,
  chapter,
}: {
  section: SectionNode;
  chapter?: string;
}) {
  return (
    <ul>
      {section.children.map((s) =>
        "children" in s ? (
          <li key={s.number}>
            <Link to={`/seksjon/${chapter}/${s.number}`}>
              {s.number} {s.title}
            </Link>
          </li>
        ) : null,
      )}
    </ul>
  );
}

export function TableOfContents({ sections }: { sections: SectionNode[] }) {
  const [matches, setMatches] = useState<FuseResult<Words>[]>([]);

  function itemMatchesSearch(section: SectionNode | ContentItem) {
    if (!matches.length) return true;
    if ("children" in section)
      return matches.some((m) => m.item.doc.chapterNumber === section.number);
    return false;
  }

  return (
    <>
      <ProgramSearch setMatches={setMatches} matches={matches} />
      <ul>
        {sections
          .filter((s) => itemMatchesSearch(s))
          .map((s) => (
            <li key={s.number}>
              {s.number} {s.title || "mangler tittel"}
              <TableOfContentSubsections chapter={s.number} section={s} />
            </li>
          ))}
      </ul>
    </>
  );
}
