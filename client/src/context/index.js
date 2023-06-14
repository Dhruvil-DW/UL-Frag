import AuthContextWrapper from "./authContext";
import CollabContextWrapper from "./collabContext";
import PromptContextWrapper from "./promptContext";

export default function Context({ children }) {

  return (
    <AuthContextWrapper>
      <PromptContextWrapper>
        <CollabContextWrapper>
          {children}
        </CollabContextWrapper>
      </PromptContextWrapper>
    </AuthContextWrapper>
  )
}