import AuthContextWrapper from "./authContext";
import PromptContextWrapper from "./promptContext";

export default function Context({ children }) {

  return (
    <AuthContextWrapper>
      <PromptContextWrapper>
        {children}
      </PromptContextWrapper>
    </AuthContextWrapper>
  )
}