import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Vet from "./components/Vet";
import Customer from "./components/Customer";
import Slot from "./components/Slot";
import Service from "./components/Service";
import Config from "./components/Config";
import {ConfigProvider} from 'antd';
import Account from "./components/Account";
function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: '#32B768',
        fontFamily: "Inter",
        fontSize: 15,
        // Alias Token
        colorBgContainer: '#ffffff',
      },
    }}
  >
    <div className="grid-container">
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route
          path="/dashboard"
          element={
            <>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Home />
            </>
          }
        />
        <Route
          path="/account"
          element={
            <>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Account />
            </>
          }
        />
        <Route
          path="/vet"
          element={
            <>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Vet />
            </>
          }
        />
        <Route
          path="/customer"
          element={
            <>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Customer />
            </>
          }
        />
        <Route
          path="/slot"
          element={
            <>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Slot />
            </>
          }
        />
        <Route
          path="/service"
          element={
            <>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Service />
            </>
          }
        />
        <Route
          path="/config"
          element={
            <>
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Config />
            </>
          }
        />
      </Routes>
    </div>
    </ConfigProvider>
  );
}

export default App;
