@@ -1,87 +1,93 @@
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
    const res = await fetch("https://ai-debate-worker.jeonjaehyeok1211.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: "반대측",
        topic: topicInput,
        topic: topicInput.value.trim(),  // topicInput.value 사용
        stage: stages[stageIndex].name,
        prompt,
      }),
    });

    // JSON 파싱
    const data = await res.json();

    // 응답 반환
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

  if (currentTurn === "user") {
    addMessage("찬성측: " + text, "user");
    userInput.value = "";
    turnIndex++;
    if (
      turnIndex < stages[stageIndex].order.length &&
      stages[stageIndex].order[turnIndex] === "ai"
    ) {
      const aiReply = await getAIResponse(text);
      addMessage("반대측: " + aiReply, "ai");
      turnIndex++;
    }
  }

  if (turnIndex >= stages[stageIndex].order.length) {
    stageIndex++;
    if (stageIndex < stages.length) {
      turnIndex = 0;
      stageLabel.innerText = `${stages[stageIndex].name} 단계 - ${
        stages[stageIndex].order[0] === "ai" ? "AI" : "인간"
      } 먼저 발언`;
      addMessage(`--- ${stages[stageIndex].name} 단계 시작 ---`, "system");
      if (stages[stageIndex].order[0] === "ai") {
        const aiIntro = await getAIResponse("다음 단계로 넘어감");
        addMessage("반대(AI): " + aiIntro, "ai");
        turnIndex++;
      }
    } else {
      stageLabel.innerText = "토론 종료";
      addMessage("✅ 토론이 모두 종료되었습니다!", "system");
    }
  }
}

// 시작 시: AI가 기다리고 인간이 먼저 입론
window.onload = () => {
  addMessage("--- 입론 단계 시작 ---", "system");
}; 

// 시작 화면 제어
window.addEventListener("load", () => {
  const overlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startButton");

  startBtn.addEventListener("click", () => {
    overlay.style.display = "none"; // 오버레이 숨기기
  });
});
