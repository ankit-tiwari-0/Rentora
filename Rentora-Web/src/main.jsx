
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./component/AuthProvider";
import { AppProvider } from "./context/Appcontext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <AppProvider>
    <AuthProvider>
      <App />
      <Toaster position="top-right" />
    </AuthProvider>
     </AppProvider>
  </BrowserRouter>
);
