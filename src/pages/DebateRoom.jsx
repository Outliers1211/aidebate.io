import { useState } from "react";
import { useParams } from "react-router-dom";

export default function DebateRoom() {
  const { topic } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}` // 여기에 API Key
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `당신은 "${decodeURIComponent(topic)}"에 대해 무조건 반대하는 토론자입니다.` },
          { role: "user", content: input }
        ],
        max_tokens: 300
      }),
    });

    const data = await res.json();
    const aiMsg = { role: "ai", content: data.choices[0].message.content };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{decodeURIComponent(topic)} 토론방</h1>
      <div className="border p-4 h-80 overflow-y-scroll mb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <p>
              <b>{m.role === "user" ? "나" : "AI(반대)"}</b>: {m.content}
            </p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="border p-2 flex-grow"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="bg-blue-500 text-white px-4" onClick={sendMessage}>
          보내기
        </button>
      </div>
    </div>
  );
}
