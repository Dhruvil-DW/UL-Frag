import AuthContextWrapper from "./authContext";
import CollabContextWrapper from "./collabContext";
import PromptContextWrapper from "./promptContext";
import QueryContextWrapper from "./queryContext";

export default function Context({ children }) {

  return (
    <AuthContextWrapper>
      <QueryContextWrapper>
        <PromptContextWrapper>
          <CollabContextWrapper>
            {children}
          </CollabContextWrapper>
        </PromptContextWrapper>
      </QueryContextWrapper>
    </AuthContextWrapper>
  )
}