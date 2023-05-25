import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { authActions, authContext } from "../../context/authContext";

export default function Logout() {
  const { authDispatch } = useContext(authContext);
  const navigate = useNavigate();
  useEffect(() => {
    authDispatch({ type: authActions.LOGOUT });
    navigate("/login");
  }, [navigate, authDispatch]);
}