async function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  userInput.value = "";

  try {
    const res = await fetch("https://ai-debate-worker.jeonjaehyeok1211.workers.dev", { // Worker 주소
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: currentTopic, userMessage: msg })
    });

    const data = await res.json();
    const aiReply = data.choices[0].message.content;
    addMessage(aiReply, "ai");

  } catch (err) {
    addMessage("AI 응답 실패: " + err.message, "ai");
  }
}
