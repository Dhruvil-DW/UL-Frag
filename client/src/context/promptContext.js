import { createContext, useReducer } from "react"
import Prompt from "../assets/prompt/prompt";

//Create Context
export const promptContext = createContext();

//Initial State and Actions
const promptInitialState = [];

export const promptActions = {
  SHOW_PROMPT: "SHOW_PROMPT",
  HIDE_PROMPT: "HIDE_PROMPT",
}

//Reducer to Handle Actions
const promptReducer = (state, action) => {
  switch (action.type) {
    case promptActions.SHOW_PROMPT:
      const newPrompt = {
        id: Math.floor(Math.random() * 1000),
        timer: action.payload.timer ?? 2000,
        type: action.payload.type ?? 'error', // 'success' | 'error' \ 'info' | 'warn'
        message: action.payload.message ?? 'Something Went Wrong',
      };
      return [...state, newPrompt];

    case promptActions.HIDE_PROMPT:
      return state.filter((prompt) => prompt.id !== action.payload);
    default:
      console.warn(`Invalid Action Found: ${action.type}`);
      return state;
  }
}

export default function PromptContextWrapper({ children }) {

  const [promptState, promptDispatch] = useReducer(promptReducer, promptInitialState);

  return (
    <promptContext.Provider value={{ promptState, promptDispatch }}>
      {children}
      <Prompt />
    </promptContext.Provider>
  )
}