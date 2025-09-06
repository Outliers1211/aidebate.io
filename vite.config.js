import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 여기서 "username"과 "ai-debate-site"는 본인 GitHub 아이디/레포 이름으로 수정!
export default defineConfig({
  plugins: [react()],
  base: "/ai-debate-site/"
});
