import React from "react";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">BIRD CLINIC</div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li
          className="sidebar-list-item"
          onClick={() => navigate("/dashboard")}
        >
          <a href="">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </a>
        </li>
        <li className="sidebar-list-item" onClick={() => navigate("/vet")}>
          <a href="">
            <BsFillArchiveFill className="icon" /> Bác sĩ thú y
          </a>
        </li>
        <li className="sidebar-list-item" onClick={() => navigate("/customer")}>
          <a href="">
            <BsPeopleFill className="icon" /> Khách hàng
          </a>
        </li>
        <li className="sidebar-list-item" onClick={() => navigate("/slot")}>
          <a href="">
            <BsFillGrid3X3GapFill className="icon" /> Lịch
          </a>
        </li>
        <li className="sidebar-list-item" onClick={() => navigate("/service")}>
          <a href="">
            <BsListCheck className="icon" /> Dịch vụ
          </a>
        </li>
        <li className="sidebar-list-item" onClick={() => navigate("/config")}>
          <a href="">
            <BsFillGearFill className="icon" /> Cấu hình
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
