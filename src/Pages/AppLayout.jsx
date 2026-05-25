import { Outlet } from "react-router-dom";

import "./AppLayout.css";
import SideBar from "../components/SideBar/SideBar";
import Logout from "../components/Logout/Logout";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

function AppLayout() {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  return (
    <div className="app-layout">
      <SideBar isOpen={sideBarOpen} onClose={() => setSideBarOpen(false)} />
      <main className="main-content">
        <div className="desktopHeader">
          <Logout />
        </div>

        <div className="topBar">
          <button
            className="hamburger"
            onClick={() => setSideBarOpen((o) => !o)}
          >
            <FaBars size={20} />
          </button>
          <Logout />
        </div>

        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
