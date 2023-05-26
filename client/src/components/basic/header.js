import { Avatar } from "@mui/material";
import UnileverIcon from "../../assets/icons/unileverIcon";

export default function Header() {
  return (
    <>
      <header className="headerWrapper">
        <div className="headerContainer">
          <div><Avatar /></div>
          <div><UnileverIcon height="48px" /></div>
        </div>
      </header>
    </>
  )
}
