import React from "react";
import SunnyIcon from "@mui/icons-material/Sunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const Theme = ({ onClick, isdark }) => {
  return (
    <div onClick={onClick}>
      {isdark ? (
        <SunnyIcon style={{ color: "#facc15", fontSize: 30 }} />
      ) : (
        <DarkModeIcon style={{ color: "#1e293b", fontSize: 30 }} />
      )}
    </div>
  );
};

export default Theme;
