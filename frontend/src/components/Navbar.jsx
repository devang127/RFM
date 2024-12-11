import React, { useState} from "react";
// import { UserContext } from "../App";
import MenuIcon from "@mui/icons-material/Menu";
// import { useNavigate } from "react-router-dom";

const Navbar = ({sidebarToggle, setSidebarToggle}) => {

  
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  



  return (
    <nav className="flex items-center justify-center w-full min-w-screen bg-white border-b-2 p-4 ">
        <div>
            <MenuIcon
                className="text-xl font-bold cursor-pointer"
                onClick={() => setSidebarToggle(!sidebarToggle)}
            />

        </div>
      <div className="container mx-auto flex justify-between items-center">
        User
      </div>
    </nav>
  );
};

export default Navbar;
