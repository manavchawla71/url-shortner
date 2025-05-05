import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Theme from "./../components/Theme";
import axios from "axios";

const URLPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [clicks, setclicks] = useState(0);
  const [isdark, setisDark] = useState(false);
  const shortenurl = location.state?.shortenurl;

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

  useEffect(() => {
    if (shortenurl) {
      const shortcode = shortenurl.split("/").pop();
      axios
        .get(`https://url-shortner-1-vxhw.onrender.com/clicks/${shortcode}`)
        .then((response) => {
          setclicks(response.data.Clicks);
        });
    }
  }, [shortenurl]);

  return (
    <>
      <div className="absolute top-4 right-4 z-50 cursor-pointer">
        <Theme onClick={handleTheme} isdark={isdark} />
      </div>

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
          <h2 className="text-xl font-semibold text-center mb-4 text-green-600">
            Your Shortened URL
          </h2>

          {shortenurl ? (
            <>
              <a
                href={shortenurl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all text-center block"
              >
                {shortenurl}
              </a>

              <p>Total no of Clicks: {clicks}</p>

              {clicks > 5 && <p className="text-red-500">Link Expired ❌</p>}

              <h2 className="mt-4">
                NOTE: The generated link can only be used 5 times. Upgrade for
                more.
              </h2>

              <button
                onClick={() => navigate("/plans")}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-1 rounded-lg transition duration-300 mt-3"
              >
                Upgrade
              </button>
            </>
          ) : (
            <p className="text-red-600 text-center">No URL found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default URLPage;
