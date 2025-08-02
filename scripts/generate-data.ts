import { InputItem, parseMarkdownLine } from "./parse-markdown-line";
import { buildDocument } from "./build-document";

process.stdin.setEncoding("utf-8");

let input = "";
process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  const items: InputItem[] = input.split("\n").map((l) => parseMarkdownLine(l));
  const unhandled = items.filter((i) => i.type === "unknown");
  if (unhandled.length) {
    console.warn({ unhandled });
  }
  console.log(JSON.stringify(buildDocument(items)));
});
