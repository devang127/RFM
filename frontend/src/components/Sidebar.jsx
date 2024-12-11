
import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Importing icons for arrows

const Sidebar = ({ sidebarToggle }) => {

  const [expandedGroup, setExpandedGroup] = useState(null);

  const groups = [
    {
      name: "RFM",
      links: [
       { path: "/recency", name: "Recency" },
        { path: "/frequency", name: "Frequency" },
        { path: "/monetary", name: "Monetary" },
      ],
    },
    
  ];

  const toggleGroup = (groupName) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  return (
    <div
      className={` inset-y-0 left-0 bg-gray-900 p-5 
        transform ${ sidebarToggle ? "-translate-x-full " : ""
      } transition-transform duration-300 ease-in-out w-60 `}
    >
      <div className="w-full flex items-center mb-6">
        <p className="text-2xl font-bold text-white ">DataAstraa</p>
      </div>
      <nav className="text-white">
        <ul>
          {groups.map((group) => (
            <li key={group.name} className="mb-4">
              <button
                onClick={() => toggleGroup(group.name)}
                className="flex justify-between items-center text-left w-full p-2 font-bold hover:bg-gray-800 rounded"
              >
                <span>{group.name}</span>
                {expandedGroup === group.name ? (
                  <FaChevronUp className="ml-2" />
                ) : (
                  <FaChevronDown className="ml-2" />
                )}
              </button>
              <hr className="border-gray-400 my-2" /> {/* White line below each heading */}
              {expandedGroup
                ? group.links.map((link) => (
                    <a
                      key={link.path}
                      href={link.path}
                      className="block p-2 hover:bg-gray-800 rounded"
                    >
                      {link.name}
                    </a>
                  ))
                : null}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;