import { useSearchContext } from "../search/searchContext";
import React from "react";

export function ShowTableOfContentsButton() {
  const { setShowTableOfContent } = useSearchContext();
  return (
    <button
      className={"tableOfContentsButton"}
      onClick={() => setShowTableOfContent((b) => !b)}
    >
      ☰
    </button>
  );
}
