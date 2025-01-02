import React from "react";
import { FaUser, FaClipboardList, FaSignOutAlt, FaHome } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";

const HeaderClient: React.FC = () => {
  return (
    <header className="shadow-lg mb-10 text-white bg-slate-950">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <ul className="flex justify-between w-full">
          {/* LEFT */}
          <div className="flex items-center space-x-4">
            <li>
              <button
                onClick={() => console.log("Cerrar sesión")}
                className="flex items-center hover:text-blue-300 transition"
              >
                <FaSignOutAlt />
              </button>
            </li>
            <li>
              <Link
                to="/dashboard/client/orders"
                className="flex items-center hover:text-blue-300 transition"
              >
                <FaClipboardList />
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/client"
                className="flex items-center hover:text-blue-300 transition"
              >
                <FaHome />
              </Link>
            </li>
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-4">
            <li>
              <Link
                to="/profile"
                className="flex items-center hover:text-blue-300 transition"
              >
                <FaUser />
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/client/cart"
                className="flex items-center hover:text-blue-300 transition"
              >
                <FaCartShopping />
              </Link>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderClient;
