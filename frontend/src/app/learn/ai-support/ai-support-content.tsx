"use client";

import { Fragment, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAiChat } from "@/lib/hooks";
import { ApiError } from "@/lib/api/client";
import type { AiMessage, AiContentBlock } from "@/lib/api/types";
import "./ai-support.css";

/**
 * AI HR Support — chat assistant.
 *
 * Faithful port of 03_ai-support.html. This app page has its own chrome
 * (`.topnav` + `<aside class="sidebar">`), ported inline as JSX.
 *
 * The original was a large imperative script that built message DOM nodes with
 * `innerHTML`, toggled the upload preview via `classList`/`style`, and removed
 * the welcome state node on first send. That is reproduced here with React
 * state: a `messages` array (rendered list), a `welcomeVisible` flag, an
 * `isLoading`/typing flag, and the uploaded-file fields. Every constant
 * (API endpoint, system prompt, suggested questions), the file-size limit
 * and icon map, the exact API request body, error/alert text and
 * message-building logic are preserved verbatim. Assistant and user text are
 * rendered through the `<RichText>` component below, which parses the same
 * lightweight markdown subset the original `formatResponse` HTML transform
 * supported (bold `**x**`, italic `*x*`, `### h3`, `- ` list items wrapped
 * in `<ul>`, paragraph breaks on `\n\n`) and emits real React elements
 * instead of injecting HTML.
 *
 * Internal links (Dashboard, Playbook) use Next `<Link>`; the LMS course link
 * stays a plain anchor per the link-rewrite rules.
 *
 * Wiring: the chat is now backed by the real `useAiChat()` mutation
 * (POST /api/ai/chat). The full conversation history is kept as `AiMessage[]`
 * and sent with every turn; the assistant reply (`{ message: AiMessage }`) is
 * appended back. Document attachments are sent as `AiContentBlock` entries of
 * type "document" with a base64 source. The system prompt is owned by the
 * backend, so it is no longer defined here.
 */

const SUGGESTED_QUESTIONS = [
  "How do I handle a disciplinary process fairly under UK law?",
  "What are the key steps in a redundancy process for 20+ employees?",
  "How should I respond when an employee discloses a mental health condition?",
  "What does a CIPD-aligned performance management framework look like?",
  "What are the legal requirements for flexible working requests in the UK?",
  "How do I calculate statutory redundancy pay?",
];

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      const key = `${keyPrefix}-${index}`;
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={key}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={key}>{part.slice(1, -1)}</em>;
      }
      return <Fragment key={key}>{part}</Fragment>;
    });
}

function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={`h-${index}`}>{renderInline(line.slice(4), `h-${index}`)}</h3>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push(
        <ul key={`ul-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={`${index}-${itemIndex}`}>
              {renderInline(item, `li-${index}-${itemIndex}`)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("### ") &&
      !lines[index].trim().startsWith("- ")
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }

    blocks.push(
      <p key={`p-${index}`}>{renderInline(paragraph.join(" "), `p-${index}`)}</p>,
    );
  }

  return <>{blocks}</>;
}

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  docName?: string | null;
};

/** Flatten an AiMessage's content down to plain text for rendering. */
function messageToText(content: AiMessage["content"]): string {
  if (typeof content === "string") return content;
  return content
    .filter((block) => block.type === "text" && block.text)
    .map((block) => block.text as string)
    .join("\n\n");
}

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res((r.result as string).split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export default function AiSupportContent() {
  const chat = useAiChat();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [typing, setTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasFile, setHasFile] = useState(false);
  const [fileIcon, setFileIcon] = useState("📄");
  const [fileName, setFileName] = useState("filename.pdf");

  // Mirrors of the original module-scoped mutable state.
  const conversationHistory = useRef<AiMessage[]>([]);
  const uploadedFileContent = useRef<string | null>(null);
  const uploadedFileName = useRef<string | null>(null);
  const isLoading = useRef(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  function scrollMessagesToBottom() {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }

  /* FILE HANDLING */
  async function handleFileUpload(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Please upload files under 10MB.");
      return;
    }
    uploadedFileName.current = file.name;
    const ext = file.name.split(".").pop()!.toLowerCase();
    const iconMap: Record<string, string> = {
      pdf: "📕",
      doc: "📘",
      docx: "📘",
      txt: "📄",
    };
    setFileIcon(iconMap[ext] || "📄");
    setFileName(file.name);
    setHasFile(true);
    // Read as text for TXT files, base64 for others
    if (ext === "txt") {
      uploadedFileContent.current = await file.text();
    } else {
      uploadedFileContent.current = await toBase64(file);
    }
  }

  function removeFile(e: React.MouseEvent) {
    e.stopPropagation();
    uploadedFileContent.current = null;
    uploadedFileName.current = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
    setHasFile(false);
  }

  /* CHAT LOGIC */
  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  function handleKeydown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function askSuggested(question: string) {
    setInputValue(question);
    sendMessage(question);
  }

  function newChat() {
    conversationHistory.current = [];
    uploadedFileContent.current = null;
    uploadedFileName.current = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
    setHasFile(false);
    setMessages([]);
    setTyping(false);
    setWelcomeVisible(true);
  }

  async function sendMessage(forcedText?: string) {
    if (isLoading.current) return;
    const text = (forcedText ?? inputValue).trim();
    if (!text) return;

    // Hide welcome state
    setWelcomeVisible(false);

    // Add user message to UI
    const sentDocName = uploadedFileName.current;
    setMessages((prev) => [
      ...prev,
      { role: "user", text, docName: sentDocName },
    ]);
    setInputValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Build message for API
    let userContent: AiMessage["content"];
    const ext = uploadedFileName.current
      ? uploadedFileName.current.split(".").pop()!.toLowerCase()
      : null;

    if (uploadedFileContent.current && ext === "txt") {
      userContent = `${text}\n\n[Document attached: ${uploadedFileName.current}]\n\n${uploadedFileContent.current}`;
    } else if (
      uploadedFileContent.current &&
      (ext === "pdf" || ext === "doc" || ext === "docx")
    ) {
      const blocks: AiContentBlock[] = [
        { type: "text", text: text },
        {
          type: "document",
          source: {
            type: "base64",
            media_type:
              ext === "pdf"
                ? "application/pdf"
                : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            data: uploadedFileContent.current,
          },
          title: uploadedFileName.current as string,
        },
      ];
      userContent = blocks;
    } else {
      userContent = text;
    }

    // Clear file after sending
    if (uploadedFileContent.current) {
      uploadedFileContent.current = null;
      uploadedFileName.current = null;
      if (fileInputRef.current) fileInputRef.current.value = "";
      setHasFile(false);
    }

    conversationHistory.current.push({ role: "user", content: userContent });

    // Show typing indicator
    setTyping(true);
    isLoading.current = true;
    requestAnimationFrame(scrollMessagesToBottom);

    try {
      // Send the full conversation history; the backend owns the system prompt.
      const { message } = await chat.mutateAsync(conversationHistory.current);

      setTyping(false);

      const assistantText =
        messageToText(message.content) ||
        "Sorry, I could not generate a response. Please try again.";

      conversationHistory.current.push({
        role: message.role,
        content: message.content,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: assistantText },
      ]);
      requestAnimationFrame(scrollMessagesToBottom);
    } catch (err) {
      setTyping(false);
      // Drop the unanswered user turn so a retry doesn't double-send it.
      conversationHistory.current.pop();
      const detail =
        err instanceof ApiError && err.status === 401
          ? `Your session has expired. Please sign in again to continue using AI HR Support.`
          : `I'm sorry — there was an error connecting to the AI service. Please try again in a moment.\n\nIf the problem persists, please contact contact@thehrplayhousehub.org for support.`;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: detail },
      ]);
      requestAnimationFrame(scrollMessagesToBottom);
      console.error("AI Support error:", err);
    }

    isLoading.current = false;
  }

  return (
    <div className="ai-support-shell">
      <nav className="topnav">
        <a className="nav-logo" href="https://www.thehrplayhousehub.org/">
          <div className="nav-logo-pill">HR Playhouse</div>
          <div className="nav-logo-text">Hub</div>
        </a>
        <div className="nav-title">AI HR Support</div>
        <div className="nav-links">
          <Link className="tnl" href="/learn/dashboard">
            Dashboard
          </Link>
          <a
            className="tnl"
            href="/learn/my-courses"
          >
            Courses
          </a>
          <Link className="tnl" href="/learn/playbook">
            Playbook
          </Link>
        </div>
        <div className="nav-right">
          <div className="disclaimer-badge">
            ⚠ Guidance only — not legal advice
          </div>
        </div>
      </nav>

      <div className="app-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sh-title">AI HR Support</div>
            <div className="sh-sub">
              Ask any HR question or upload a document for expert analysis.
            </div>
          </div>

          <div className="suggested-section">
            <div className="sq-label">Suggested questions</div>
            <div className="sq-chips">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  className="sq-chip"
                  onClick={() => askSuggested(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="upload-section">
            <div className="ul-label">Upload a document</div>
            <div className={`upload-zone${hasFile ? " has-file" : ""}`}>
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => handleFileUpload(e.currentTarget)}
              />
              <div style={{ display: hasFile ? "none" : "block" }}>
                <div className="uz-icon">📎</div>
                <div className="uz-text">
                  <strong>Click to upload</strong> or drag &amp; drop
                </div>
                <div className="uz-types">PDF, Word, or TXT · Max 10MB</div>
              </div>
              <div className={`file-preview${hasFile ? " show" : ""}`}>
                <div className="fp-icon">{fileIcon}</div>
                <div className="fp-name">{fileName}</div>
                <button
                  className="fp-remove"
                  onClick={removeFile}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div className="info-section">
            <div className="info-card">
              <div className="ic-title">What I can help with</div>
              <div className="ic-item">
                <div className="ic-dot" />
                Employment law questions (UK, Nigeria, USA, Singapore)
              </div>
              <div className="ic-item">
                <div className="ic-dot" />
                HR policy and process guidance
              </div>
              <div className="ic-item">
                <div className="ic-dot" />
                Analysing HR documents you upload
              </div>
              <div className="ic-item">
                <div className="ic-dot" />
                CIPD and SHRM framework questions
              </div>
              <div className="ic-item">
                <div className="ic-dot" />
                Performance, recruitment, and ER advice
              </div>
              <div className="ic-item">
                <div className="ic-dot" />
                Drafting template language for HR conversations
              </div>
            </div>
          </div>
        </aside>

        {/* CHAT */}
        <div className="chat-area">
          <div className="messages" ref={messagesRef}>
            {welcomeVisible && (
              <div className="welcome-state">
                <div className="ws-icon">🤖</div>
                <div className="ws-title">Your AI HR Advisor</div>
                <div className="ws-sub">
                  Ask any HR question and get research-backed, evidence-led
                  answers grounded in CIPD frameworks, employment law, and best
                  practice.
                </div>
                <div className="ws-capabilities">
                  <span className="ws-cap">🇬🇧 UK law</span>
                  <span className="ws-cap">🇳🇬 Nigerian law</span>
                  <span className="ws-cap">🇺🇸 US law</span>
                  <span className="ws-cap">🇸🇬 Singapore law</span>
                  <span className="ws-cap">📚 CIPD-aligned</span>
                  <span className="ws-cap">📎 Document analysis</span>
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                <div className="msg-avatar">
                  {m.role === "user" ? "You" : "🤖"}
                </div>
                <div className="msg-bubble">
                  {m.docName ? (
                    <div className="msg-doc-tag">📎 {m.docName}</div>
                  ) : null}
                  <RichText text={m.text} />
                </div>
              </div>
            ))}

            {typing && (
              <div className="message assistant">
                <div className="msg-avatar">🤖</div>
                <div className="msg-bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="input-area">
            <div className="disclaimer">
              Guidance only — not a substitute for qualified legal advice.
              Always consult an employment lawyer for specific legal situations.
            </div>
            <div className="input-row">
              <button className="new-chat-btn" onClick={newChat}>
                + New chat
              </button>
              <div className="input-wrap">
                <textarea
                  className="chat-input"
                  ref={textareaRef}
                  value={inputValue}
                  placeholder="Ask an HR question or describe your situation…"
                  rows={1}
                  onKeyDown={handleKeydown}
                  onInput={(e) => autoResize(e.currentTarget)}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <button
                className="send-btn"
                disabled={chat.isPending}
                onClick={() => sendMessage()}
                title="Send"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
