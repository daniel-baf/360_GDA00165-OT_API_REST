import { useNavigate } from "react-router-dom";

const useRedirect = () => {
  const navigate = useNavigate();

  const redirectTo = (path: string) => {
    navigate(path);
  };

  return { redirectTo };
};

export { useRedirect };
