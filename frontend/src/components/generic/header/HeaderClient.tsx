import { AuthContext } from "@context/auth/signin/Signin.context";
import { NotificationTypes } from "@context/Notification.context";
import useRedirectWithMessage from "@helpers/auth/redirecter.helper";
import React, { useContext } from "react";
import { FaUser, FaClipboardList, FaSignOutAlt, FaHome } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";

const HeaderClient: React.FC = () => {
  const authContext = useContext(AuthContext);
  const redirectTo = useRedirectWithMessage();

  if (!authContext) {
    return;
  }

  function signOut() {
    authContext?.clearToken();
    redirectTo("/", "Sesión cerrada", NotificationTypes.SUCCESS);
  }

  return (
    <header className="shadow-lg mb-10 text-white bg-slate-950">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <ul className="flex justify-between w-full text-lg">
          {/* LEFT */}
          <div className="flex items-center space-x-6">
            <li>
              <button
                onClick={signOut}
                className="flex items-center hover:text-blue-300 transition text-xl"
              >
                <FaSignOutAlt />
              </button>
            </li>
            <li>
              <Link
                to="/dashboard/client/orders"
                className="flex items-center hover:text-blue-300 transition text-xl"
              >
                <FaClipboardList />
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/client"
                className="flex items-center hover:text-blue-300 transition text-xl"
              >
                <FaHome />
              </Link>
            </li>
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-6">
            <li>
              <Link
                to="/profile"
                className="flex items-center hover:text-blue-300 transition text-xl"
              >
                <FaUser />
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/client/cart"
                className="flex items-center hover:text-blue-300 transition text-xl"
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
