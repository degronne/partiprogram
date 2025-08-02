import { SectionNode } from "../../data/program";
import React from "react";
import { Link } from "react-router-dom";

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
  return (
    <ul>
      {sections.map((s) => (
        <li key={s.number}>
          {s.number} {s.title || "mangler tittel"}
          <TableOfContentSubsections chapter={s.number} section={s} />
        </li>
      ))}
    </ul>
  );
}
