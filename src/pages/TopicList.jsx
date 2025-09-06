import { Link } from "react-router-dom";

const topics = [
  "AI는 일자리를 빼앗는다",
  "AI 예술은 진정한 예술이다",
  "AI가 인간보다 더 윤리적일 수 있다"
];

export default function TopicList() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">토론 주제를 선택하세요</h1>
      <ul>
        {topics.map((t, i) => (
          <li key={i} className="mb-2">
            <Link className="text-blue-600 underline" to={`/debate/${encodeURIComponent(t)}`}>
              {t}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
