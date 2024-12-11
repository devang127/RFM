import React from "react";
import Sidebar from '../src/components/Sidebar'
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const Layout = ({   setSidebarToggle, sidebarToggle }) => {
  return (
<>    
      <Navbar
      sidebarToggle={sidebarToggle}
      setSidebarToggle={setSidebarToggle}/>    
      <Sidebar 
      sidebarToggle={sidebarToggle}
      setSidebarToggle={setSidebarToggle}
      />  
      <div
        className={`w-full h-screen transition-all duration-300 ease-in-out `}
      >
        <Outlet />
      </div>
  
</>
  );
};

export default Layout;