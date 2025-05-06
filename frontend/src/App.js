import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AnalysisResume from "./analysisResume";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home route */}
          <Route path="/" element={<Home />} />
          {/* Resume analysis route */}
          <Route path="/analyze" element={<AnalysisResume />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
