import { useNavigate } from "react-router-dom";

const useRedirectWithMessage = () => {
  const navigate = useNavigate();

  const redirectTo = (path: string, message: string) => {
    navigate(path, { state: { message } });
  };

  return redirectTo;
};

export default useRedirectWithMessage;
