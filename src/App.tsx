import { Route, Router, Switch } from "wouter";

import { useHashLocation } from "./hooks/useHashLocation";
import MainLayout from "./components/MainLayout.tsx";
import React, { Suspense } from "react";

const Providers = React.lazy(() => import("./components/providers.tsx"));
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Pay = React.lazy(() => import("./pages/Pay"));

function App() {
  return (
    <Providers>
      <MainLayout>
        <Suspense fallback={null}>
          <Router hook={useHashLocation}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/:address" component={Pay} />
            </Switch>
          </Router>
        </Suspense>
      </MainLayout>
    </Providers>
  );
}

export default App;
