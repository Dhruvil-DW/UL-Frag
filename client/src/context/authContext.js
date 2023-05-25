import { createContext, useReducer } from "react"
import jwt_decode from "jwt-decode";

//Create Context
export const authContext = createContext();

//Initial State and Actions
const authInitialState = {
  token: localStorage.getItem("token"),
  userdata: localStorage.getItem("userdata"),
  isAuth: false
}

export const authActions = {
  AUTH_SUCCESS: "AUTH_SUCCESS",
  AUTH_FAILED: "AUTH_FAILED",
  LOGOUT: "LOGOUT"
}

//Reducer to Handle Actions
const authReducer = (__state, action) => {
  switch (action.type) {
    case authActions.AUTH_SUCCESS:
      const token = action.payload.token;
      const userdata = jwt_decode(action.payload.token);
      localStorage.setItem("token", token);
      localStorage.setItem("userdata", JSON.stringify(userdata));
      return { isAuth: true, token, userdata };

    case authActions.AUTH_FAILED:
    case authActions.LOGOUT:
      localStorage.setItem("token", null);
      localStorage.setItem("userdata", null);
      return { isAuth: false, token: null, userdata: null };

    default:
      console.warn(`Invalid Action Found: ${action.type}`);
      return;
  }
}

export default function AuthContextWrapper({ children }) {

  const [authState, authDispatch] = useReducer(authReducer, authInitialState);

  return (
    <authContext.Provider value={{ authState, authDispatch }}>
      {children}
    </authContext.Provider>
  )
}