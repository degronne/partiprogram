import { InputItem, parseMarkdownLine } from "./parse-markdown-line";

process.stdin.setEncoding("utf-8");

let input = "";
process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  const output: InputItem[] = input
    .split("\n")
    .map((l) => parseMarkdownLine(l));
  console.warn({
    unhandledCount: output.filter((i) => i.type === "unknown").length,
  });
  console.log(JSON.stringify({ output }));
});
