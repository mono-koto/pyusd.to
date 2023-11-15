import { Route, Router, Switch } from "wouter";

import { useHashLocation } from "./hooks/useHashLocation";
import MainLayout from "./components/layout";
import React from "react";

const Providers = React.lazy(() => import("./components/providers.tsx"));
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Pay = React.lazy(() => import("./pages/Pay"));

function App() {
  return (
    <Providers>
      <MainLayout>
        <Router hook={useHashLocation}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/:address" component={Pay} />
          </Switch>
        </Router>
      </MainLayout>
    </Providers>
  );
}

export default App;
