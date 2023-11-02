import { Route, Router } from "wouter";

import { useHashLocation } from "./hooks/useHashLocation";
import About from "./pages/About";
import Pay from "./pages/Pay";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Router hook={useHashLocation}>
          <Route path="" component={Home} />
          <Route path="about" component={About} />
          <Route path=":address" component={Pay} />
        </Router>
      </div>
    </>
  );
}

export default App;
