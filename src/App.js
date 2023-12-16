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
import { ConfigProvider } from "antd";
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
          colorPrimary: "#32B768",
          fontFamily: "Inter",
          fontSize: 15,
          // Alias Token
          colorBgContainer: "#ffffff",
        },
      }}
    >
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route
          path="/dashboard"
          element={
            <div className="grid-container">
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Home />
            </div>
          }
        />
        <Route
          path="/account"
          element={
            <div className="grid-container">
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Account />
            </div>
          }
        />
        <Route
          path="/vet"
          element={
            <div className="grid-container">
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Vet />
            </div>
          }
        />
        <Route
          path="/customer"
          element={
            <div className="grid-container">
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Customer />
            </div>
          }
        />
        <Route
          path="/slot"
          element={
            <div className="grid-container">
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Slot />
            </div>
          }
        />
        <Route
          path="/service"
          element={
            <div className="grid-container">
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Service />
            </div>
          }
        />
        <Route
          path="/config"
          element={
            <div className="grid-container">
              <Header OpenSidebar={OpenSidebar} />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Config />
            </div>
          }
        />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
