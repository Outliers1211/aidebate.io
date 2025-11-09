const stages = [
  { name: "입론", order: ["user"] },
  { name: "교차조사", order: ["ai"] },
  { name: "입론", order: ["ai"] },
  { name: "교차조사", order: ["user"] },
  { name: "반론", order: ["ai", "user", "user", "ai"] },
  { name: "결론", order: ["user", "ai"] },
];

let stageIndex = 0;
let turnIndex = 0;

const chatBox = document.getElementById("chatBox");
const stageLabel = document.getElementById("stage");
const userInput = document.getElementById("userInput");
const topicInput = document.getElementById("topic");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function getAIResponse(prompt) {
  try {
    const res = await fetch("https://ai-debate-worker.jeonjaehyeok1211.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: "반대측",
        topic: topicInput.value,
        stage: stages[stageIndex].name,
        prompt,
      }),
    });
    const data = await res.json();
    return data.reply || "AI 응답 오류";
  } catch (e) {
    return "⚠️ AI 응답을 가져오지 못했습니다.";
  }
}

async function processTurn() {
  if (stageIndex >= stages.length) {
    stageLabel.innerText = "토론 종료";
    addMessage("✅ 토론이 모두 종료되었습니다!", "system");
    return;
  }

  const currentTurn = stages[stageIndex].order[turnIndex];

  if (currentTurn === "user") {
    // 사용자가 입력할 때까지 기다리기
    stageLabel.innerText = `${stages[stageIndex].name} 단계 - 사용자 발언 차례`;
    return;
  }

  if (currentTurn === "ai") {
    stageLabel.innerText = `${stages[stageIndex].name} 단계 - AI 발언 중...`;
    const aiReply = await getAIResponse("AI가 다음 발언합니다.");
    addMessage("반대측: " + aiReply, "ai");
    turnIndex++;
    // 다음 턴 자동 진행
    processTurn();
  }
}

async function sendMessage() {
  const text = userInput.value.trim();
  const topic = topicInput.value.trim();
  if (!text || !topic) return;

  const currentTurn = stages[stageIndex].order[turnIndex];

  if (currentTurn !== "user") return; // 사용자의 차례가 아니면 무시

  addMessage("찬성측: " + text, "user");
  userInput.value = "";
  turnIndex++;

  if (turnIndex >= stages[stageIndex].order.length) {
    // 다음 단계로 넘어가기
    stageIndex++;
    turnIndex = 0;
    if (stageIndex < stages.length) {
      addMessage(`--- ${stages[stageIndex].name} 단계 시작 ---`, "system");
    }
  }

  // 다음 턴 처리
  processTurn();
}

// 시작 시 첫 단계 처리
window.onload = () => {
  addMessage(`--- ${stages[stageIndex].name} 단계 시작 ---`, "system");
  processTurn();
};
