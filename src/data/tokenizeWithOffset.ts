export type DocWord = { word: string; start: number; end: number };

const nonUsefulWords = new Set(["kunne"]);

export function tokenizeWithOffset(text: string): DocWord[] {
  const tokens = [];
  const wordRegex = /\p{L}+/gu; // Matches one or more Unicode letters
  let match;

  while ((match = wordRegex.exec(text)) !== null) {
    const word = match[0].toLowerCase();
    if (word.length >= 4 && !nonUsefulWords.has(word))
      tokens.push({
        word,
        start: match.index,
        end: match.index + match[0].length,
      });
  }

  return tokens;
}
