import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../context/authContext";

export function Redirect() {
  const navigate = useNavigate();
  const { authState } = useContext(authContext);
  console.debug({ authState }, { navigate });
  useEffect(() => {
    switch (authState.userdata?.role_id) {
      case 0:
        navigate('/profile');
        return;
      case 1:
      case 2:
        navigate('/dashboard');
        return;
      default:
        navigate('/login');
    }
  }, [navigate, authState]);
} 