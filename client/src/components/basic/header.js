import { Avatar, Button } from "@mui/material";
import UnileverIcon from "../../assets/icons/unileverIcon";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../../context/authContext";
import LogoutArrowIcon from "../../assets/icons/logout_arrow";
export default function Header() {
  const navigate = useNavigate();
  const { authState } = useContext(authContext);
  const userdata = authState.userdata;
  return (
    <>
      <header className="headerWrapper">
        <div className="headerContainer">
          <div style={{ display: 'flex', gap: "1rem", alignItems: "center", textTransform: "capitalize", color:"#7C8DB5", fontWeight:400 }}>
            <Avatar />Hello {`${userdata.first_name} ${userdata.last_name}`},
          <Button variant="text" color="secondary" style={{ position:'absolute', top:71, left:86 }} startIcon={<LogoutArrowIcon />} onClick={() => navigate("/logout")}>
            Logout
          </Button>
          {/* <Link to='/logout' startIcon={<LogoutArrowIcon />} style={{ position:'absolute', top:61, left:87 }} color="secondary">Logout</Link> */}
          </div>
          <div style={{ fontSize: 64}}>
            <UnileverIcon style={{ display: "block" }} />
          </div>
        </div>
      </header>
    </>
  );
}
