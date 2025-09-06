import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopicList from "./pages/TopicList";
import DebateRoom from "./pages/DebateRoom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopicList />} />
        <Route path="/debate/:topic" element={<DebateRoom />} />
      </Routes>
    </Router>
  );
}
