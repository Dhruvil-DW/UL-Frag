import { createContext, useReducer } from "react"

//Create Context
export const collabContext = createContext();

//Initial State and Actions
const collabInitialState = { isOpen: false };

export const collabActions = {
  SHOW_COLLAB: "SHOW_COLLAB",
  HIDE_COLLAB: "HIDE_COLLAB",
}

//Reducer to Handle Actions
const collabReducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case collabActions.SHOW_COLLAB:
      return { isOpen: true , appData: action.payload ?? null };

    case collabActions.HIDE_COLLAB:
      return { isOpen: false };

    default:
      console.warn(`Invalid Action Found: ${action.type}`);
      return state;
  }
}

export default function CollabContextWrapper({ children }) {

  const [collabState, collabDispatch] = useReducer(collabReducer, collabInitialState);

  return (
    <collabContext.Provider value={{ collabState, collabDispatch }}>
      {children}
    </collabContext.Provider>
  )
}