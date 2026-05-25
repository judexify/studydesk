import { NavLink } from "react-router-dom";
import "./SideBar.css";
import {
  FaBook,
  FaBookReader,
  FaClock,
  FaHome,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { FaBookJournalWhills, FaBookOpenReader } from "react-icons/fa6";

function SideBar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={`sidebarOverlay ${isOpen ? "overlayVisible" : ""}`}
        onClick={onClose}
      />
      <nav className={`sidebar ${isOpen ? "sidebarOpen" : ""}`}>
        <h1 className="logo">
          <span>
            <FaBookReader size={16} />
          </span>
          StudyDesk
        </h1>
        <ul className="nav-list">
          <li>
            <NavLink to="dashboard">
              <FaHome size={16} />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="courses">
              <FaBook size={16} />
              Courses
            </NavLink>
          </li>
          <li>
            <NavLink to="assignments">
              <FaBookJournalWhills size={16} /> Assignments
            </NavLink>
          </li>
          {/* <li>
          <NavLink to="study-log">
            <FaBookOpenReader size={16} /> Study Log
          </NavLink>
        </li> */}
          <li>
            <NavLink to="schedule">
              <FaClock size={16} />
              Schedule
            </NavLink>
          </li>
        </ul>

        <div className="theme-mode">
          <button>
            <FaMoon />
          </button>
          <button>
            <FaSun />
          </button>
        </div>
      </nav>
    </>
  );
}

export default SideBar;
