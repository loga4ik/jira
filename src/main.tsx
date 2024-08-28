import { createRoot } from "react-dom/client";
import App from "./App/App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./Lib/store.ts";
import { ThemeContextWrapper } from "./Context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeContextWrapper>
      <App />
    </ThemeContextWrapper>
  </Provider>
);
