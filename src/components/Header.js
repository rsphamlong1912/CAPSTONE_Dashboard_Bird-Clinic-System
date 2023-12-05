import React from "react";
// import { styles } from "./Header.module.scss";
import { BsJustify } from "react-icons/bs";
import { Button, Input } from "antd";
const { Search } = Input;

function Header({ OpenSidebar }) {
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">
        <Search
          placeholder="Nhập để tìm kiếm..."
          allowClear
          enterButton="Tìm kiếm"
          size="large"
          // onSearch={onSearch}
        />
      </div>
      <div className="header-right">
        <Button size="large" type="default">Admin</Button>
      </div>
    </header>
  );
}

export default Header;
