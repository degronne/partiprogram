import { fuse, SectionNode, Words } from "../../data/program";
import React, { useEffect, useState } from "react";
import { FuseResult } from "fuse.js";

export function ProgramSearch({
  matches,
  setMatches,
}: {
  matches: FuseResult<Words>[];
  setMatches: (wordMatch: FuseResult<Words>[]) => void;
}) {
  const [query, setQuery] = useState("");
  function executeQuery() {
    console.log({ query });
    const result = query.split(" ").flatMap((w) => fuse.search(w));
    setMatches(result);
    console.log({ result });
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
        <p>{matches.length > 0 && `${matches.length} treff`}</p>
      </form>
    </div>
  );
}
