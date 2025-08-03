import React from "react";
import { useSearchContext } from "../search/searchContext";

export function ProgramSearch() {
  const { query, setQuery, matches } = useSearchContext();

  return (
    <div>
      <form>
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
