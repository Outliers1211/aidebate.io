const chatBox = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const topicInput = document.getElementById("topic");

const WORKER_URL = "https://ai-debate-worker.jeonjaehyeok1211.workers.dev";

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

async function sendMessage() {
  const msg = userInput.value.trim();
  const topic = topicInput.value.trim();
  if (!msg || !topic) return;

  addMessage(msg, "user");
  userInput.value = "";

  const aiContainer = addMessage("...", "ai");

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, userMessage: msg })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    aiContainer.textContent = ""; // 초기화

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (let line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.replace("data: ", "").trim();
          if (data === "[DONE]") return;

          try {
            const json = JSON.parse(data);
            const token = json.choices[0]?.delta?.content || "";
            aiContainer.textContent += token;
            chatBox.scrollTop = chatBox.scrollHeight;
          } catch (e) {
            console.error("파싱 오류:", e);
          }
        }
      }
    }
  } catch (err) {
    aiContainer.textContent = "AI 응답 실패: " + err.message;
  }
}
