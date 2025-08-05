import React from "react";
import { useSearchContext } from "../search/searchContext";

export function ProgramSearch() {
  const { query, setQuery } = useSearchContext();

  return (
    <div>
      <form>
        <input
          type={"search"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>Søk</button>
      </form>
    </div>
  );
}
