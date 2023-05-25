import AuthContextWrapper from "./authContext";

export default function Context({ children }) {

  return (
    <AuthContextWrapper>
      {children}
    </AuthContextWrapper>
  )
}