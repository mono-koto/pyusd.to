import { Route, Router, Switch } from "wouter";

import { useHashLocation } from "./hooks/useHashLocation";
import About from "./pages/About";
import Pay from "./pages/Pay";
import Home from "./pages/Home";
import MainLayout from "./components/layout";

function App() {
  return (
    <>
      {/* <div className="flex flex-col items-center justify-center min-h-screen py-2"> */}
      <MainLayout>
        <Router hook={useHashLocation}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/:address" component={Pay} />
          </Switch>
        </Router>
      </MainLayout>
      {/* </div> */}
    </>
  );
}

export default App;
