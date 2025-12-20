const stages = [
  { name: "입론", order: ["user", "ai"] },
  { name: "교차조사", order: ["ai", "user"] },
  { name: "반론", order: ["ai", "user"] },
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
    const res = await fetch(
      "https://ai-debate-worker.jeonjaehyeok1211.workers.dev",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "반대측",
          topic: topicInput.value.trim(),
          stage: stages[stageIndex].name,
          prompt,
        }),
      }
    );

    const data = await res.json();
    return data.reply || "AI 응답 오류";
  } catch (e) {
    console.error(e);
    return "⚠️ AI 응답을 가져오지 못했습니다.";
  }
}

async function sendMessage() {
  const text = userInput.value.trim();
  const topic = topicInput.value.trim();
  if (!text || !topic) return;

  const currentTurn = stages[stageIndex].order[turnIndex];

  // 인간 차례
  if (currentTurn === "user") {
    addMessage("찬성측: " + text, "user");
    userInput.value = "";
    turnIndex++;
  }

  // AI 차례라면 자동 응답
  if (
    turnIndex < stages[stageIndex].order.length &&
    stages[stageIndex].order[turnIndex] === "ai"
  ) {
    const aiReply = await getAIResponse(text);
    addMessage("반대측: " + aiReply, "ai");
    turnIndex++;
  }

  // 단계 완료되면 다음 단계로 이동
  if (turnIndex >= stages[stageIndex].order.length) {
    stageIndex++;

    if (stageIndex < stages.length) {
      turnIndex = 0;

      stageLabel.innerText = `${stages[stageIndex].name} 단계 - ${
        stages[stageIndex].order[0] === "ai" ? "AI" : "인간"
      } 먼저 발언`;

      addMessage(`--- ${stages[stageIndex].name} 단계 시작 ---`, "system");

      // 다음 단계가 AI 먼저라면 자동 발언 시작
      if (stages[stageIndex].order[0] === "ai") {
        const aiIntro = await getAIResponse("새로운 단계가 시작되었습니다");
        addMessage("반대측: " + aiIntro, "ai");
        turnIndex++;
      }
    } else {
      stageLabel.innerText = "토론 종료";
      addMessage("✅ 토론이 모두 종료되었습니다!", "system");
    }
  }
}

// 시작 안내 메시지
window.onload = () => {
  addMessage("--- 입론 단계 시작 ---", "system");
};
