/* eslint-disable react-hooks/exhaustive-deps */
import SignUp from "@components/auth/signup/Signup";
import Modal from "@components/generic/Modal";
import { AuthContext } from "@context/auth/signin/Signin.context";
import { NotificationContext } from "@context/Notification.context";
import {
  fetchAlterUserStatus,
  fetchUserStatuses,
} from "@services/status/user.status.service";
import { UserStatusType } from "@services/status/user.status.types";
import { UserTypes } from "@services/users/user.types";
import { fetchDeleteUser, fetchListUsers } from "@services/users/users.service";
import { Settings } from "CONFIGURATION";
import React, { useContext, useEffect, useState } from "react";
import {
  FaBan,
  FaCheckCircle,
  FaClock,
  FaLockOpen,
  FaPlusCircle,
  FaTrashAlt,
} from "react-icons/fa";

const AdminUserDashboard: React.FC = () => {
  const CURRENT_LIMIT = Settings.MAX_ITEMS_PER_LONG_LIST;
  const CURRENT_OFFSET = 0;

  const authContext = useContext(AuthContext);
  const notifications = useContext(NotificationContext);
  const [users, setUsers] = useState<UserTypes[]>([]);
  const [states, setStates] = useState<UserStatusType[]>([]); // states of the users (active, inactive, etc.)
  const token = authContext?.token;

  // fetch users
  useEffect(() => {
    if (!token) return;
    fetchListUsers(CURRENT_LIMIT, CURRENT_OFFSET, token)
      .then((res) => {
        setUsers(res);
      })
      .catch((err) => {
        notifications?.showError(err);
      });

    // fetch states
    fetchUserStatuses(token)
      .then((res) => {
        setStates(res);
      })
      .catch((err) => {
        notifications?.showError(err.message);
      });
  }, [token]);

  const onClickAlterStatus = (new_status: number, user_id: number) => {
    if (!token) return;
    fetchAlterUserStatus(token, new_status, user_id)
      .then((res) => {
        notifications?.showSuccess(
          res +
            "Nuevo estado: " +
            states.find((state) => state.id === new_status)?.nombre
        );
        // update the user status
        const user = users.find((user) => user.id === user_id);
        if (user) {
          user.estado_usuario_id = new_status;
        }
        setUsers([...users]); // force re-render
      })
      .catch((err) => {
        notifications?.showError(err);
      });
  };

  const onCLickDeleteUser = (user_id: number) => {
    if (!token) return;
    fetchDeleteUser(user_id, token)
      .then((res) => {
        notifications?.showSuccess(res);
        // remove the user from the list
        setUsers(users.filter((user) => user.id !== user_id));
      })
      .catch((err) => {
        notifications?.showError(err.message);
      });
  };

  return (
    <div className="text-stone-200 container mx-auto">
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold mb-4">Usuarios del sistema</h1>
        <p className="text-lg text-gray-400">
          Aquí puedes realizar operaciones relacionadas con los usuarios, como
          bloquearlos, borrarlos, etc.
        </p>
      </div>

      {/* CONTENT */}

      <div className="flex w-100 justify-end">
        {/* MODAL */}
        <Modal
          title="Nuevo usuario"
          width="500px"
          description="Aquí puedes crear un nuevo usuario, como eres admin, puedes darle roles especificos"
          triggerButton={
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-200">
              <FaPlusCircle className="inline-block mr-2" /> Crear
            </button>
          }
          content={<SignUp />}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-gray-600 mt-10">
          <thead className="bg-gray-800">
            <tr className="text-center uppercase">
              <th className="border border-gray-600 px-4 py-2 w-1/12">ID</th>
              <th className="border border-gray-600 px-4 py-2 w-3/12">Email</th>
              <th className="border border-gray-600 px-4 py-2 w-2/12">
                Fecha de Creación
              </th>
              <th className="border border-gray-600 px-4 py-2 w-2/12">Rol</th>
              <th className="border border-gray-600 px-4 py-2 w-2/12">
                Estado
              </th>
              <th className="border border-gray-600 px-4 py-2 w-2/12">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-gray-700 hover:bg-slate-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200 text-end">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                  {user.fecha_creacion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 uppercase text-center">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full  ${
                      user.rol_id === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.rol_id === 1 ? "cliente" : "operativo"}
                  </span>
                </td>
                <td className="pt-1 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <span className="flex items-center justify-center flex-col gap-2">
                    {user.estado_usuario_id === 1 && (
                      <FaBan className="text-4xl text-red-500" />
                    )}
                    {user.estado_usuario_id === 2 && (
                      <FaClock className="text-4xl text-yellow-500" />
                    )}
                    {user.estado_usuario_id === 3 && (
                      <FaCheckCircle className="text-4xl text-green-500" />
                    )}
                    {
                      states.find(
                        (state) => state.id === user.estado_usuario_id
                      )?.nombre
                    }
                  </span>
                </td>
                <td>
                  {/* ACTIONS */}
                  <div className="flex justify-center space-x-4 w-100">
                    <button
                      className="bg-red-500 text-white px-3 py-3 sm:px-4 sm:py-4 rounded-md shadow-md hover:bg-blue-600 transition-all duration-200 w-full sm:w-auto"
                      onClick={() => onCLickDeleteUser(user.id)}
                    >
                      <FaTrashAlt />
                    </button>
                    {user.estado_usuario_id === 1 && (
                      <button
                        className="bg-blue-500 text-white px-3 py-3 sm:px-4 sm:py-4 rounded-md shadow-md hover:bg-blue-600 transition-all duration-200 w-full sm:w-auto"
                        onClick={() => onClickAlterStatus(3, user.id)}
                      >
                        <FaLockOpen />
                      </button>
                    )}
                    {user.estado_usuario_id === 2 && (
                      <button
                        className="bg-blue-500 text-white px-3 py-3 sm:px-4 sm:py-4 rounded-md shadow-md hover:bg-blue-600 transition-all duration-200 w-full sm:w-auto"
                        onClick={() => onClickAlterStatus(3, user.id)}
                      >
                        <FaClock />
                      </button>
                    )}
                    {user.estado_usuario_id === 3 && (
                      <button
                        className="bg-yellow-600 text-white px-3 py-3 sm:px-4 sm:py-4 rounded-md shadow-md hover:bg-blue-600 transition-all duration-200 w-full sm:w-auto"
                        onClick={() => onClickAlterStatus(1, user.id)}
                      >
                        <FaBan />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserDashboard;
