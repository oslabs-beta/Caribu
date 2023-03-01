import { Link, Route, Routes } from "react-router-dom";

import WelcomePage from "./components/WelcomePage";
import RouteExplorer from "./views/RouteExplorer";
import Purity from "./views/PurityOverview";
import Metrics from "./views/Metrics";

export default function App() {
  return (
    <div>
      <div>
        <Link to="/">Welcome page</Link>
      </div>
      <div>
        <Link to="/rexplorer">Route Explorer</Link>
      </div>
      <div>
        <Link to="/purity">Purity Overview</Link>
      </div>
      <div>
        <Link to="/metrics">Metrics</Link>
      </div>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/rexplorer" element={<RouteExplorer />} />
        <Route path="/purity" element={<Purity />} />
        <Route path="/metrics" element={<Metrics />} />
      </Routes>
    </div>
  );
}
