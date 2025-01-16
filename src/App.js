import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchImages from "./component/SearchImages";
import CanvasEditor from "./component/CanvasEditor";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchImages/>} />
        <Route path="/caption-editor" element={<CanvasEditor/>} />
      </Routes>
    </Router>
  );
};

export default App;
