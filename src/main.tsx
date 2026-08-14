import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* BrowserRouter watches the address bar. Anything that renders a <Link>
        or calls useNavigate must sit INSIDE it, or it throws at runtime. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
