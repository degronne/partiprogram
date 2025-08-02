import React, { useEffect, useState } from "react";
import { search, SearchMatch } from "../../data/search";
import { DocDocumentFragment } from "../../data/document";

export function ProgramSearch({
  matches,
  setMatches,
}: {
  matches: Map<DocDocumentFragment, SearchMatch[]>;
  setMatches: (wordMatch: Map<DocDocumentFragment, SearchMatch[]>) => void;
}) {
  const [query, setQuery] = useState("");
  function executeQuery() {
    setMatches(search(query));
  }

  useEffect(() => executeQuery(), [query]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeQuery();
        }}
      >
        <input
          type={"search"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>Søk</button>
        <p>{matches.size > 0 && `${matches.size} treff`}</p>
      </form>
    </div>
  );
}
