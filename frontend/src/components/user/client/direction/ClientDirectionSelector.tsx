import { useAuthContext } from "@context/auth/signin/Signin.context";
import { getTokenDecoded } from "@helpers/auth/auth.service";
import fetchUserDirections from "@services/users/direction/user.direction.service";
import { UserDirectionTypes } from "@services/users/direction/user.direction.types";
import React, { useEffect, useState } from "react";

interface ClientDirectionSelectorProps {
  handleDirectionClick: (direction: UserDirectionTypes) => void;
}

const ClientDirectionSelector: React.FC<ClientDirectionSelectorProps> = ({
  handleDirectionClick,
}) => {
  const authContext = useAuthContext();
  const [directions, setdirections] = useState<UserDirectionTypes[]>([]);
  const [selectedDirectionId, setSelectedDirectionId] = useState<number | null>(
    null
  );

  // fetch for directions
  useEffect(() => {
    const logged_user = getTokenDecoded(authContext.token!);

    if (!logged_user) return;
    // fetch directions
    fetchUserDirections(logged_user.id, `${authContext.token}`).then((data) => {
      setdirections(data);
    });
  }, [authContext?.token]);

  const handleClick = (direction: UserDirectionTypes) => {
    setSelectedDirectionId(direction.id); // Update the selected direction ID
    handleDirectionClick(direction); // Execute the passed function
  };

  return (
    <div className="text-white">
      <div className="grid grid-cols-1 gap-4">
        {directions.map((direction) => (
          <div
            key={direction.id}
            className={`p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 bg-slate-600 ${
              selectedDirectionId === direction.id
                ? "border-4 border-blue-500"
                : ""
            }`}
            onClick={() => handleClick(direction)} // Use the updated click handler
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-center">
                  {direction.direccion}
                </h3>
                <p className="text-sm text-center">{direction.departamento}</p>
                <p className="text-sm text-center">{direction.municipio}</p>
                <p className="text-sm text-center">{direction.telefono}</p>
              </div>
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDirectionSelector;
