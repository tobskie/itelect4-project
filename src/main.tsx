import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import App from "./App.tsx";

// ONE client for the whole app. It owns the cache every useQuery reads, and it
// is created OUT here, outside the component tree -- inside a component, a
// re-render would build a new one and throw the whole cache away.
const queryClient = new QueryClient({
  // Default is 3 retries: a failure takes ~7s to appear. 1 retry: ~1s.
  defaultOptions: { queries: { retry: 1 } },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Same idea as BrowserRouter: anything calling useQuery must sit inside
        this provider, or it throws at runtime. */}
    <QueryClientProvider client={queryClient}>
      {/* BrowserRouter watches the address bar. Anything that renders a <Link>
          or calls useNavigate must sit INSIDE it, or it throws at runtime. */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* A floating panel, dev builds only -- npm run build strips it out. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
