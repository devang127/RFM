import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Rfm from '../pages/recency.jsx';


const UserDashboard = () => {
    const [sidebarToggle, setSidebarToggle] = useState(false);

  return (
    <>
        <div className='flex bg-gray-100 '>
            <Sidebar sidebarToggle={sidebarToggle}/>
                <div className={`flex flex-grow  
                                justify-start overflow-x-auto
                                flex flex-col min-h-screen
                                transform ${sidebarToggle ? "-ml-60 " : "ml-0"}
                                transition-all duration-600 ease-in-out
                                `}>
                    <div className="flex flex-col xs:w-screen sm:w-screen lg:w-full">
                        <Navbar 
                            sidebarToggle={sidebarToggle} 
                            setSidebarToggle={setSidebarToggle}/>
                        {/* <TableDashboard/> */}
                        <Rfm/>
                        
                        
                        <Outlet/>
                    </div>
                </div>
        </div>
    </>
  )
}

export default UserDashboard