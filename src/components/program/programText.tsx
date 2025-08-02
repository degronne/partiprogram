import { ContentItem, SectionNode } from "../../data/program";
import React, { useEffect, useRef } from "react";
import { Route, Routes, useParams } from "react-router-dom";

export function ProgramText({ sections }: { sections: SectionNode[] }) {
  return (
    <Routes>
      <Route
        path={"/seksjon/:chapterId/:sectionId"}
        element={<SingleChapter sections={sections} />}
      />
      <Route path={"*"} element={<AllChapters sections={sections} />} />
    </Routes>
  );
}

function SingleChapter({ sections }: { sections: SectionNode[] }) {
  const params = useParams();
  const { chapterId, sectionId } = params;

  const section = sections.find((s) => s.number == chapterId);
  if (section) {
    return <ProgramSection section={section} focusedId={sectionId} />;
  }

  return (
    <h1>
      {chapterId} del: {sectionId}
    </h1>
  );
}

export function AllChapters({ sections }: { sections: SectionNode[] }) {
  return (
    <>
      {sections.map((s) => (
        <ProgramSection key={s.number} section={s} />
      ))}
    </>
  );
}
function ProgramChild({
  child,
  focusedId,
}: {
  child: SectionNode | ContentItem;
  focusedId?: string;
}) {
  if ("children" in child) {
    return <ProgramSection section={child} focusedId={focusedId} />;
  }
  if (child.type === "paragraph") return <p>{child.text}</p>;
  return (
    <li>
      {child.number} {child.text}
    </li>
  );
}

export function ProgramSection({
  section: { number, title, children },
  focusedId,
}: {
  section: SectionNode;
  focusedId?: string;
}) {
  const ref = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    console.log({ number, focusedId });
    if (number === focusedId)
      ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <li key={number} ref={ref}>
      {number} {title || "Missing title"}
      <ul>
        {children.map((c, index) => (
          <ProgramChild key={index} child={c} focusedId={focusedId} />
        ))}
      </ul>
    </li>
  );
}
