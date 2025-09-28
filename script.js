const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const debateRoom = document.getElementById("debate-room");
const topicSelection = document.getElementById("topic-selection");
const topicTitle = document.getElementById("topic-title");

let currentTopic = "";

// 토론 시작
function startDebate(topic) {
  currentTopic = topic;
  topicTitle.textContent = topic;
  topicSelection.style.display = "none";
  debateRoom.style.display = "block";
  chatBox.innerHTML = "";
}

// 메시지 전송
async function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  userInput.value = "";

  try {
    const res = await fetch("https://ai-debate-worker.jeonjaehyeok1211.workers.dev", { // 여기를 본인 Worker URL로 변경
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

// 채팅에 메시지 추가
function addMessage(message, sender) {
  const div = document.createElement("div");
  div.className = sender;
  div.textContent = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 뒤로가기
function goBack() {
  debateRoom.style.display = "none";
  topicSelection.style.display = "block";
}
