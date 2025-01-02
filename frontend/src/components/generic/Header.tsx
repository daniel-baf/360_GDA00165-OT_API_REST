import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth/signin/Signin.context";
import { getTokenDecoded } from "../../helpers/auth/auth.service";
import HeaderAdmin from "./header/HeaderAdmin";
import HeaderClient from "./header/HeaderClient";

const Header: React.FC = () => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token;
  const [isAdmin, setIsAdmin] = useState(false);

  // check typeo user
  useEffect(() => {
    if (!token) {
      return;
    }
    setIsAdmin(getTokenDecoded(token)?.rol_id === 2);
    // const roleId = getRoleIdFromToken(a);
  }, [token]);

  return <>{isAdmin ? <HeaderAdmin /> : <HeaderClient />}</>;
};

export default Header;
