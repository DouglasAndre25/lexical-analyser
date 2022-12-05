import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import AnalyzePage from "./pages/Analyze";

import "./App.scss";

const App = () => {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
