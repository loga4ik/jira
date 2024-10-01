import { createRoot } from "react-dom/client";
import App from "./UI/App/App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./Lib/store.ts";
import { ThemeContextWrapper } from "./Context/ThemeContext.tsx";
import { ThemeProvider } from "@material-tailwind/react";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <ThemeContextWrapper>
        <App />
      </ThemeContextWrapper>
    </ThemeProvider>
  </Provider>
);
