import { AuthContext } from "@context/auth/signin/Signin.context";
import { NotificationTypes } from "@context/Notification.context";
import {
  FaBoxOpen,
  FaCashRegister,
  FaHome,
  FaMizuni,
  FaSignOutAlt,
  FaUser,
  FaUserAltSlash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import useRedirectWithMessage from "@helpers/auth/redirecter.helper";
import { useContext } from "react";

const HeaderAdmin: React.FC = () => {
  const authContext = useContext(AuthContext);
  const redirectTo = useRedirectWithMessage();
  const current_url_path = "/dashboard/admin";

  function signOut() {
    authContext?.clearToken();
    redirectTo("/", "Sesión cerrada", NotificationTypes.SUCCESS);
  }

  return (
    <header className="shadow-lg mb-10 text-white bg-slate-950 text-xl">
      <nav className="container mx-auto flex items-center justify-between p-6">
        <ul className="flex flex-col md:flex-row justify-between w-full">
          {/* LEFT */}
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <li>
              <button
                onClick={signOut}
                className="flex items-center hover:text-blue-300 transition text-2xl"
              >
                <FaSignOutAlt />
              </button>
            </li>
            <li>
              <Link
                to={current_url_path}
                className="flex items-center hover:text-blue-300 transition text-2xl"
              >
                <FaHome />
              </Link>
            </li>

            <li className="relative group">
              <button className="flex items-center hover:text-blue-300 transition text-2xl">
                <FaBoxOpen />
              </button>
              <ul className="absolute left-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <li>
                  <Link
                    to={`${current_url_path}/products`}
                    className="block px-4 py-2 hover:bg-gray-200 text-lg"
                  >
                    <span className="flex items-center">
                      <FaCashRegister className="mx-2 text-2xl" />
                      Productos
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={`${current_url_path}/categories`}
                    className="block px-4 py-2 hover:bg-gray-200 text-lg"
                  >
                    <span className="flex items-center">
                      <FaMizuni className="mx-2 text-2xl" />
                      Categorias
                    </span>
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                to={`${current_url_path}/users`}
                className="flex items-center hover:text-blue-300 transition text-2xl"
              >
                <FaUserAltSlash />
              </Link>
            </li>
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-6">
            <li>
              <Link
                to="/profile"
                className="flex items-center hover:text-blue-300 transition text-2xl"
              >
                <FaUser />
              </Link>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderAdmin;
