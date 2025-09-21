"use client";
import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  async function send() {
    if (!input.trim()) return;
    const next = [...messages, { role: "user", content: input } as Msg];
    setMessages(next);
    setInput("");

const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ input }),  // 👈 send a single prompt string
});

    if (!res.ok || !res.body) {
      setMessages((p) => [...p, { role: "assistant", content: "Server error — check terminal." }]);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let text = "";
    setMessages((p) => [...p, { role: "assistant", content: "" }]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      setMessages((p) => {
        const copy = [...p];
        copy[copy.length - 1] = { role: "assistant", content: text };
        return copy;
      });
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Hello AI (Gemini)</h1>

      <div className="border rounded-lg bg-gray-50 p-4 h-80 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <p key={i} className={m.role === "user" ? "text-gray-900" : "text-blue-700"}>
            <b>{m.role}:</b> {m.content}
          </p>
        ))}
        {!messages.length && <p className="text-gray-500">Type a question below and hit Send.</p>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ask something…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="bg-blue-600 text-white rounded px-4 py-2" onClick={send}>
          Send
        </button>
      </div>
    </main>
  );
}
