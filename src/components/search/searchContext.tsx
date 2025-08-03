import React, { ReactNode, useContext, useEffect, useState } from "react";
import { DocDocumentFragment } from "../../data/document";
import { search, SearchMatch } from "../../data/search";

const SearchContext = React.createContext<{
  matches: Map<DocDocumentFragment, SearchMatch[]>;
  setMatches: (matches: Map<DocDocumentFragment, SearchMatch[]>) => void;
  query: string;
  setQuery: (query: string) => void;
}>({ matches: new Map(), setMatches: () => {}, query: "", setQuery: () => {} });

export function SearchContextProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<
    Map<DocDocumentFragment, SearchMatch[]>
  >(new Map());
  const [query, setQuery] = useState(sessionStorage.getItem("query") || "");
  useEffect(() => sessionStorage.setItem("query", query), [query]);
  useEffect(() => setMatches(search(query)), [query]);

  return (
    <SearchContext value={{ matches, setMatches, query, setQuery }}>
      {children}
    </SearchContext>
  );
}

export function useSearchContext() {
  const { matches, query, setQuery } = useContext(SearchContext);
  function matchesInclude(fragment: DocDocumentFragment) {
    if (!matches.size) return true;

    if ("sectionId" in fragment) {
      return [...matches.keys()].some(
        (m) => "sectionId" in m && m.sectionId === fragment.sectionId,
      );
    }

    return [...matches.keys()].some((m) => m.chapterId === fragment.chapterId);
  }

  function matchingDirectChildren(fragment: DocDocumentFragment) {
    const { chapterId, sectionId } = fragment;
    return [...matches.keys()].filter(
      (match) =>
        match.sectionId === sectionId &&
        match.chapterId === chapterId &&
        (match.type === "paragraph" || match.type === "numberedItem"),
    );
  }

  return { matchesInclude, matchingDirectChildren, query, setQuery, matches };
}
