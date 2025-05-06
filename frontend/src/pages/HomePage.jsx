import React, { useState, useEffect } from "react";
import axios from "axios";
import dotenv from "dotenv";
import { useNavigate } from "react-router-dom";
import Theme from "./../components/Theme";

const HomePage = () => {
  const [enteredurl, setenteredurl] = useState("");
  const [shortenurl, setshortenurl] = useState("");
  const [isdark, setisDark] = useState(false);
  const [code, setcode] = useState("");
  const navigate = useNavigate();
  dotenv.config();
  const handleTheme = () => {
    const newTheme = !isdark;
    setisDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setisDark(true);
    }
  }, []);

  const handleGenerate = () => {
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/shorten`, {
        enteredurl,
        code,
      })
      .then((response) => {
        setshortenurl(response.data.shortUrl);
        navigate("/shortener", {
          state: { shortenurl: response.data.shortUrl },
        });
      })
      .catch((err) => {
        alert("Error generating short URL");
        console.error(err);
      });
  };

  return (
    <>
      {/* Theme toggle button at top right */}
      <div className="absolute top-4 right-4 z-50 cursor-pointer">
        <Theme onClick={handleTheme} isdark={isdark} />
      </div>

      {/* Background and text color change */}
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${
          isdark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <div
          className={`shadow-2xl rounded-2xl p-8 max-w-xl w-full ${
            isdark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h1 className="text-2xl font-bold mb-4 text-center text-blue-500">
            URL Shortener
          </h1>

          <input
            type="text"
            placeholder="Enter your long URL"
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 ${
              isdark ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            value={enteredurl}
            onChange={(e) => setenteredurl(e.target.value)}
          />

          <h1 className="mt-5">Want Personalised code (Optional)</h1>
          <input
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 ${
              isdark ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            type="text"
            placeholder="Write your Code here"
            onChange={(e) => setcode(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
          >
            Shorten URL
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
