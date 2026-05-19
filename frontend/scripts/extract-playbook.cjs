const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(
  root,
  "Corrected Files for HRPH",
  "everyday_hr_playbook_v3.html",
);
const h = fs.readFileSync(src, "utf8");

const startMarker = '<div class="entries-col">';
const s = h.indexOf(startMarker) + startMarker.length;
const scriptIdx = h.indexOf("<script>");
const region = h.slice(s, scriptIdx);
const tail = region.lastIndexOf("\n  </div>\n</div>\n\n");
let inner = region.slice(0, tail);

// Strip inline onclick handlers; React event delegation re-binds the exact
// original behaviour (toggleEntry / switchJur / downloadChecklist).
inner = inner.replace(/ onclick="[^"]*"/g, "");

const esc = inner
  .replace(/\\/g, "\\\\")
  .replace(/`/g, "\\`")
  .replace(/\$\{/g, "\\${");

const out =
  "// Auto-extracted from Corrected Files for HRPH/everyday_hr_playbook_v3.html.\n" +
  "// The 10 playbook entries are large, fully-static markup blocks preserved\n" +
  "// verbatim here. Only the inline onclick attributes were removed — the\n" +
  "// playbook page re-binds toggle / jurisdiction-tab / download behaviour via\n" +
  "// React event delegation that reproduces the original functions exactly.\n" +
  "/* eslint-disable */\n" +
  "export const PLAYBOOK_ENTRIES_HTML = `" +
  esc +
  "`;\n";

fs.writeFileSync(
  path.join(root, "src", "app", "playbook", "playbook-entries.ts"),
  out,
  "utf8",
);

console.log("entries:", (inner.match(/class="entry /g) || []).length);
console.log("jur-tab:", (inner.match(/class="jur-tab/g) || []).length);
console.log("dl-btn:", (inner.match(/class="dl-btn"/g) || []).length);
console.log("module bytes:", out.length);
