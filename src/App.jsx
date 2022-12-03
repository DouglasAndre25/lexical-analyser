import { BrowserRouter, Routes } from "react-router-dom";
import Header from "./components/Header";

import "./App.scss";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes></Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
