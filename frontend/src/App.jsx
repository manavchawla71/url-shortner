import { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import URLPage from "./pages/URLPage";
import PlansPage from "./pages/PlansPage";

function App() {
  // const [enteredurl, setenteredurl] = useState("");
  // const [shortenurl, setshortenurl] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shortener" element={<URLPage />} />
        <Route path="/plans" element={<PlansPage />} />
      </Routes>
    </Router>

    // {shortenurl && (
    //   <div className="mt-6 text-center">
    //     <p className="text-gray-700 mb-2">Your shortened URL:</p>
    //     <a
    //       href={shortenurl}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       className="text-blue-600 hover:underline break-all"
    //     >
    //       {shortenurl}
    //     </a>
    //   </div>
    // )}
    //   </div>
    // </div>
  );
}

export default App;
