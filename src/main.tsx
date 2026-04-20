
  import { createRoot } from "react-dom/client";
  import App from "./App";
  import { AuthProvider } from "./contexts/AuthContext";
  import "./index.css";

  // Diagnostics
  // eslint-disable-next-line no-console
  console.log("[BOOT] main.tsx starting");
  const rootEl = document.getElementById("root");
  if (!rootEl) {
    // eslint-disable-next-line no-console
    console.error("[BOOT ERROR] #root not found");
  }

  // Removed custom global error overlay to avoid persistent bottom-left banner

  try {
    createRoot(rootEl!).render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    // eslint-disable-next-line no-console
    console.log("[BOOT] React root rendered");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[BOOT ERROR]", e);
  }
  