import React from "react";
// import { styles } from "./Header.module.scss";
import { BsJustify } from "react-icons/bs";
import { Button, Input, Avatar } from "antd";
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
      <Button style={{marginRight: 10}} size="large" type="primary">Khám tổng quát</Button>

        <Button style={{marginRight: 10}} size="large" type="default">Bác sĩ Phạm Ngọc Long</Button>
        <Avatar size={50} src="https://taimuihongsg.com/wp-content/uploads/2019/01/Trinh-Tan-Lap_taimuihongsg.jpg" />

      </div>
    </header>
  );
}

export default Header;
