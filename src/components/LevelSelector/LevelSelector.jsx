import { useState } from "react";
import "./LevelSelector.css";

function LevelSelector({ onSetShowModal }) {
  const [selected, setSelected] = useState(
    () => localStorage.getItem("level") || "400",
  );

  function handleChange(e) {
    setSelected(e.target.value);
  }

  function handleConfirm() {
    localStorage.setItem("level", selected);
    onSetShowModal(false);
  }

  return (
    <div className="overlay">
      <div className="levelSelectorModal">
        <h2>Welcome to StudyDesk 👋</h2>
        <p>Select your current level to personalize your dashboard.</p>
        <select value={selected} onChange={handleChange}>
          <option value="400">400 Level</option>
        </select>
        <button type="button" onClick={handleConfirm}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default LevelSelector;
