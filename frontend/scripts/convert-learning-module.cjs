// One-shot conversion script for learning_module_v2.html → React JSX.
// This is throwaway — it produces learning-module-content.tsx and learning-module.css.
const fs = require("fs");
const path = require("path");

const SRC = path.resolve(
  __dirname,
  "..",
  "Corrected Files for HRPH",
  "learning_module_v2.html",
);
const TSX_OUT = path.resolve(
  __dirname,
  "..",
  "src",
  "app",
  "learning-module",
  "learning-module-content.tsx",
);
const CSS_OUT = path.resolve(
  __dirname,
  "..",
  "src",
  "app",
  "learning-module",
  "learning-module.css",
);

const raw = fs.readFileSync(SRC, "utf8");
const lines = raw.split(/\r?\n/);

// ── 1. Extract CSS (lines between first <style> and matching </style> in <head>) ──
const cssStart = lines.findIndex((l) => /<style>\s*$/.test(l));
const cssEnd = lines.findIndex(
  (l, i) => i > cssStart && /^\s*<\/style>\s*$/.test(l),
);
if (cssStart === -1 || cssEnd === -1) throw new Error("no main <style> block");
const cssBlock = lines.slice(cssStart + 1, cssEnd).join("\n");
fs.writeFileSync(CSS_OUT, cssBlock + "\n");

// ── 2. Extract <body>…</body> content (the outermost) ──
// The outermost body opens at the line with /^<body>$/ after </head>, closes at last </body>
const bodyOpenIdx = lines.findIndex(
  (l, i) => i > cssEnd && /^<body>\s*$/.test(l),
);
const lastBodyCloseIdx = lines.length - lines.slice().reverse().findIndex((l) => /^<\/body>\s*$/.test(l)) - 1;
if (bodyOpenIdx === -1) throw new Error("no body open");
let bodyContent = lines.slice(bodyOpenIdx + 1, lastBodyCloseIdx).join("\n");

// ── 3. Extract the top-level <script>…</script> from the body content & remove ──
// We know there is exactly one outermost script block (the page handlers).
// It is the final <script>…</script> in the body, NOT inside a srcdoc attribute.
// Approach: find the LAST occurrence of "  <script>" (with 2-space indent typical of outermost),
// then the LAST </script> after it.
const scriptStart = bodyContent.lastIndexOf("\n  <script>\n");
const scriptEnd = bodyContent.lastIndexOf("\n  </script>");
if (scriptStart === -1 || scriptEnd === -1 || scriptEnd <= scriptStart)
  throw new Error("could not locate outer <script>");
bodyContent =
  bodyContent.slice(0, scriptStart) +
  bodyContent.slice(scriptEnd + "\n  </script>".length);
bodyContent = bodyContent.trim();

// ── 4. Find and extract iframe srcdoc attributes so we can keep them as constants ──
// Pattern: srcdoc="…" — value spans many lines & contains escaped &quot; quotes.
// We replace each iframe with a placeholder, capturing the srcdoc HTML separately.
const iframes = [];
// match: <iframe class="game-frame" srcdoc="(.*?)" title="(.*?)" loading="lazy"></iframe>
const iframeRe =
  /<iframe class="game-frame" srcdoc="([\s\S]*?)" title="([^"]*)" loading="lazy"><\/iframe>/g;
bodyContent = bodyContent.replace(iframeRe, (_m, srcdoc, title) => {
  const idx = iframes.length;
  // Decode &quot; back to " for raw storage
  const decoded = srcdoc.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  iframes.push({ html: decoded, title });
  return `<iframe className="game-frame" srcDoc={GAME_${idx}_SRCDOC} title="${title}" loading="lazy"></iframe>`;
});

// ── 5. Mechanical JSX conversions on the remaining body content ──
let jsx = bodyContent;

// Fix the lone source-HTML bug: a <p> at "sustainability." block has no </p>.
// Add it back so JSX parses. (Browsers auto-close <p>; JSX won't.)
jsx = jsx.replace(
  /(human capability with organizational purpose, HR becomes indispensable to performance, culture, and\s*\n\s*sustainability\.)\s*\n(\s*<\/div>)/,
  "$1</p>\n$2",
);

// Quote bare attribute values like  class=formula-sub  →  class="formula-sub"
// Only target alphanum/hyphen attribute values to be safe.
jsx = jsx.replace(/\b(class|id|name|type|value)=([A-Za-z][\w-]*)(\s|>)/g, '$1="$2"$3');

// Strip HTML-style comments (outside iframe srcdocs, which we extracted earlier)
jsx = jsx.replace(/<!--[\s\S]*?-->/g, "");

// class= → className=
jsx = jsx.replace(/\bclass=/g, "className=");
// for= → htmlFor=
jsx = jsx.replace(/\sfor="/g, " htmlFor=\"");
// Self-close void elements: <br>, <hr>, <img …>, <input …>, <meta …>, <link …>
jsx = jsx.replace(/<br\s*>/g, "<br />");
jsx = jsx.replace(/<hr\s*>/g, "<hr />");
jsx = jsx.replace(/<img\b([^>]*?)(\s*)>/g, (m, attrs) => {
  // Remove trailing /
  attrs = attrs.replace(/\s*\/$/, "");
  return `<img${attrs} />`;
});
jsx = jsx.replace(/<input\b([^>]*?)(\s*)>/g, (m, attrs) => {
  attrs = attrs.replace(/\s*\/$/, "");
  return `<input${attrs} />`;
});
jsx = jsx.replace(/<meta\b([^>]*?)>/g, "<meta$1 />");
jsx = jsx.replace(/<link\b([^>]*?)>/g, "<link$1 />");

// onclick → onClick. Convert onclick="foo(args)" → onClick={() => foo(args)}.
// Special handling: goTab('xxx') → setActiveTab("xxx")
jsx = jsx.replace(/onclick="goTab\('([a-z0-9]+)'\)"/g, 'onClick={() => setActiveTab("$1")}');
jsx = jsx.replace(/onclick="toggleCard\(this\)"/g, 'onClick={(e) => toggleCard(e.currentTarget)}');
jsx = jsx.replace(/onclick="toggleTopic\(this\)"/g, 'onClick={(e) => toggleTopic(e.currentTarget)}');
// Generic fallback
jsx = jsx.replace(/onclick="([^"]+)"/g, (m, code) => {
  // Escape quotes and braces minimally — but in practice everything above should be covered
  return `onClick={() => { ${code.replace(/"/g, '\\"')} }}`;
});

// Inline style="..." → style={{ ... }}
jsx = jsx.replace(/style="([^"]*)"/g, (m, css) => {
  const obj = {};
  css.split(";").forEach((decl) => {
    decl = decl.trim();
    if (!decl) return;
    const colon = decl.indexOf(":");
    if (colon === -1) return;
    const prop = decl.slice(0, colon).trim();
    const val = decl.slice(colon + 1).trim();
    const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    obj[camel] = val;
  });
  const inner = Object.entries(obj)
    .map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`)
    .join(", ");
  return `style={{ ${inner} }}`;
});

// HTML entities
const entities = {
  "&mdash;": "—",
  "&ndash;": "–",
  "&middot;": "·",
  "&hellip;": "…",
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&rdquo;": "”",
  "&ldquo;": "“",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
  "&#127968;": "🏠",
  "&#128203;": "📋",
};
// Numeric entities like &#xxxx; → unicode char
jsx = jsx.replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(parseInt(n, 10)));
jsx = jsx.replace(/&#x([0-9a-fA-F]+);/g, (_m, n) => String.fromCodePoint(parseInt(n, 16)));
for (const [k, v] of Object.entries(entities)) {
  jsx = jsx.split(k).join(v);
}

// Replace any remaining `&` not part of a recognized entity with &amp; for JSX safety in text only.
// Actually JSX accepts literal & in text just fine. Leave alone.

// Fix href trailing slashes for internal routes (those that include thehrplayhousehub.org/SOMETHING/)
// Per spec, strip trailing slashes for internal routes. The nav uses absolute URLs to the live site —
// keep those as-is per the prompt (external links stay). So we only touch href values that are
// pure paths like href="/dashboard/". There are likely few or none in this file; safe no-op.
jsx = jsx.replace(/href="(\/[^"#?]*)\/"/g, 'href="$1"');

// Make panel + nav-tab "active" classes follow React state.
// nav-tab buttons in topbar:
jsx = jsx.replace(
  /<button className="nav-tab(?: active)?" onClick=\{\(\) => setActiveTab\("([a-z0-9]+)"\)\}>/g,
  '<button className={`nav-tab${activeTab === "$1" ? " active" : ""}`} onClick={() => setActiveTab("$1")}>',
);
// Panels: <div id="tab-XX" className="panel"> or "panel active"
jsx = jsx.replace(
  /<div id="tab-([a-z0-9]+)" className="panel(?: active)?">/g,
  '<div id="tab-$1" className={`panel${activeTab === "$1" ? " active" : ""}`}>',
);

// Wire the upload zone refs/handlers (final-project section). The original page
// looked these up by id; we keep the ids for CSS and attach refs as well.
jsx = jsx.replace(
  /<div id="upload-zone" className="upload-zone">/,
  '<div id="upload-zone" className="upload-zone" ref={uploadZoneRef} onClick={openFileDialog} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>',
);
jsx = jsx.replace(
  /<input([^>]*?)id="fp-file-input"([^>]*?)\/>/,
  '<input$1id="fp-file-input"$2 ref={fileInputRef} onChange={handleInputChange} />',
);
jsx = jsx.replace(
  /<div id="file-preview" className="file-preview">/,
  '<div id="file-preview" className="file-preview" ref={filePreviewRef}>',
);
jsx = jsx.replace(
  /<div id="file-card-icon" className="file-card-icon">[^<]*<\/div>/,
  '<div id="file-card-icon" className="file-card-icon" ref={fileCardIconRef}></div>',
);
jsx = jsx.replace(
  /<div id="file-card-name" className="file-card-name">[^<]*<\/div>/,
  '<div id="file-card-name" className="file-card-name" ref={fileCardNameRef}></div>',
);
jsx = jsx.replace(
  /<div id="file-card-size" className="file-card-size">[^<]*<\/div>/,
  '<div id="file-card-size" className="file-card-size" ref={fileCardSizeRef}></div>',
);
jsx = jsx.replace(
  /<button id="file-remove-btn"([^>]*?)>/,
  '<button id="file-remove-btn"$1 ref={fileRemoveBtnRef} onClick={handleRemove}>',
);
jsx = jsx.replace(
  /<button id="submit-btn"([^>]*?)disabled([^>]*?)>/,
  '<button id="submit-btn"$1$2 ref={submitBtnRef} onClick={handleSubmit} disabled>',
);
jsx = jsx.replace(
  /<div id="submit-success"([^>]*?)>/,
  '<div id="submit-success"$1 ref={submitSuccessRef}>',
);
jsx = jsx.replace(
  /<span\s+id="current-file-ext">[^<]*<\/span>/,
  '<span id="current-file-ext" ref={currentFileExtRef}>PDF</span>',
);

// Indent the body content by 6 spaces to nest under the JSX return
const indented = jsx.split("\n").map((l) => (l ? "      " + l : "")).join("\n");

// ── 6. Build the final TSX file ──
const tsx = `"use client";

import { useEffect, useRef, useState } from "react";
import "./learning-module.css";

type TabId = "home" | "l1" | "l2" | "l3" | "l4" | "fp";

${iframes
  .map(
    (f, i) =>
      `const GAME_${i}_SRCDOC = ${JSON.stringify(f.html)};`,
  )
  .join("\n\n")}

export default function LearningModuleContent() {
  const [activeTab, setActiveTabState] = useState<TabId>("home");

  // Mark each level as "started" in localStorage when first visited, mirroring
  // the original page's progress tracking behaviour.
  function setActiveTab(id: TabId) {
    setActiveTabState(id);
    if (typeof window === "undefined") return;
    try {
      window.scrollTo(0, 0);
      localStorage.setItem("hrph_last_tab", id);
      if (id === "l1") {
        localStorage.setItem("hrph_level1_started", "true");
        localStorage.setItem("hrph_current_level", "l1");
      } else if (id === "l2") {
        localStorage.setItem("hrph_level2_started", "true");
        localStorage.setItem("hrph_current_level", "l2");
      } else if (id === "l3") {
        localStorage.setItem("hrph_level3_started", "true");
        localStorage.setItem("hrph_current_level", "l3");
      } else if (id === "l4") {
        localStorage.setItem("hrph_level4_started", "true");
        localStorage.setItem("hrph_current_level", "l4");
      } else if (id === "fp") {
        localStorage.setItem("hrph_final_project_started", "true");
      }
    } catch {}
  }

  // Restore last tab + read ?tab= on first mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const allowed: TabId[] = ["home", "l1", "l2", "l3", "l4", "fp"];
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("tab");
    if (requested && (allowed as string[]).includes(requested)) {
      setActiveTab(requested as TabId);
    }
  }, []);

  // Accordion handlers — toggle the same CSS classes the original script did,
  // but scoped to the clicked DOM node so we don't have to mirror every card's
  // state in React. Simple and matches the original markup exactly.
  function toggleCard(head: HTMLElement) {
    head.classList.toggle("open");
    const body = head.nextElementSibling;
    if (body) body.classList.toggle("open");
  }
  function toggleTopic(band: HTMLElement) {
    band.classList.toggle("open");
  }

  // ─────── Final-project file upload (was initUpload in the original) ───────
  const uploadZoneRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const filePreviewRef = useRef<HTMLDivElement | null>(null);
  const fileCardIconRef = useRef<HTMLDivElement | null>(null);
  const fileCardNameRef = useRef<HTMLDivElement | null>(null);
  const fileCardSizeRef = useRef<HTMLDivElement | null>(null);
  const fileRemoveBtnRef = useRef<HTMLButtonElement | null>(null);
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);
  const submitSuccessRef = useRef<HTMLDivElement | null>(null);
  const currentFileExtRef = useRef<HTMLSpanElement | null>(null);

  function openFileDialog() {
    fileInputRef.current?.click();
  }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    uploadZoneRef.current?.classList.add("dragover");
  }
  function handleDragLeave() {
    uploadZoneRef.current?.classList.remove("dragover");
  }
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    uploadZoneRef.current?.classList.remove("dragover");
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }
  function handleFile(file: File) {
    const allowedExts = ["pdf", "pptx", "ppt", "doc", "docx"];
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!allowedExts.includes(ext)) {
      alert("Please upload a PDF, PPTX, or Word document.");
      return;
    }
    const size = (file.size / 1024 / 1024).toFixed(1) + " MB";
    const icons: Record<string, string> = {
      pdf: "📄",
      pptx: "📊",
      ppt: "📊",
      doc: "📝",
      docx: "📝",
    };
    if (fileCardIconRef.current) fileCardIconRef.current.textContent = icons[ext] || "📎";
    if (fileCardNameRef.current) fileCardNameRef.current.textContent = file.name;
    if (fileCardSizeRef.current) fileCardSizeRef.current.textContent = size;
    if (filePreviewRef.current) filePreviewRef.current.style.display = "block";
    if (uploadZoneRef.current) uploadZoneRef.current.style.display = "none";
    if (submitBtnRef.current) submitBtnRef.current.disabled = false;
    if (currentFileExtRef.current)
      currentFileExtRef.current.textContent = ext.toUpperCase();
  }
  function handleRemove() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (filePreviewRef.current) filePreviewRef.current.style.display = "none";
    if (uploadZoneRef.current) uploadZoneRef.current.style.display = "block";
    if (submitBtnRef.current) submitBtnRef.current.disabled = true;
  }
  function handleSubmit() {
    const btn = submitBtnRef.current;
    if (!btn || btn.disabled) return;
    btn.textContent = "⏳ Submitting...";
    btn.disabled = true;
    setTimeout(() => {
      if (submitSuccessRef.current)
        submitSuccessRef.current.style.display = "block";
      btn.style.display = "none";
    }, 1800);
  }

  return (
    <>
${indented}
    </>
  );
}
`;

fs.writeFileSync(TSX_OUT, tsx);
console.log(`Wrote ${TSX_OUT}: ${tsx.split("\n").length} lines`);
console.log(`Wrote ${CSS_OUT}: ${cssBlock.split("\n").length} lines`);
console.log(`Embedded ${iframes.length} game iframes`);
