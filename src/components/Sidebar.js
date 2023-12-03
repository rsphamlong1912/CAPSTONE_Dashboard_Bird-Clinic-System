import React, { useState } from "react";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsStack ,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsFillPersonLinesFill,
  BsCalendar2EventFill  
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const [onFocusSidebar, setOnFocusSidebar] = useState("");
  const navigate = useNavigate();
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : "" }
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">Ad<span className="black-text">min</span></div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li
          className={`sidebar-list-item ${onFocusSidebar === "" ? "active" : ""}`}
          onClick={() => {navigate("/dashboard"); setOnFocusSidebar("")}}
        >
            <BsGrid1X2Fill className="icon" /> Dashboard
        </li>
        <li className={`sidebar-list-item ${onFocusSidebar === "vet" ? "active" : ""}`} onClick={() => {navigate("/vet"); setOnFocusSidebar("vet")}}>
            <BsFillPersonLinesFill  className="icon" /> Nhân sự
        </li>
        <li className={`sidebar-list-item ${onFocusSidebar === "customer" ? "active" : ""}`} onClick={() => {navigate("/customer"); setOnFocusSidebar("customer")}}>
            <BsPeopleFill className="icon" /> Khách hàng
          
        </li>
        <li className={`sidebar-list-item ${onFocusSidebar === "slot" ? "active" : ""}`} onClick={() => {navigate("/slot"); setOnFocusSidebar("slot")}}>
            <BsCalendar2EventFill   className="icon" /> Lịch phòng khám
        </li>
        <li className={`sidebar-list-item ${onFocusSidebar === "service" ? "active" : ""}`} onClick={() => {navigate("/service"); setOnFocusSidebar("service")}}>
            <BsStack  className="icon" /> Dịch vụ
        </li>
        <li className={`sidebar-list-item ${onFocusSidebar === "config" ? "active" : ""}`} onClick={() => {navigate("/config");setOnFocusSidebar("config")}}>
            <BsFillGearFill className="icon" /> Cấu hình
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
