import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import SuspenseFallback from "./components/SuspenseFallback.tsx";
import App from "./App.tsx";

// const App = React.lazy(() => import("./App.tsx"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <Suspense fallback={<SuspenseFallback />}> */}
    <App />
    {/* </Suspense> */}
  </React.StrictMode>
);
