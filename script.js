const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const debateRoom = document.getElementById("debate-room");
const topicSelection = document.getElementById("topic-selection");
const topicTitle = document.getElementById("topic-title");

let currentTopic = "";

// OpenAI API Key (학교 프로젝트용 테스트)
const OPENAI_KEY = "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";

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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `당신은 "${currentTopic}"에 대해 무조건 반대하는 토론자입니다.` },
          { role: "user", content: msg }
        ],
        max_tokens: 200
      })
    });

    const data = await response.json();
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
