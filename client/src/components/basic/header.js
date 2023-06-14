import { Avatar, Button } from "@mui/material";
import UnileverIcon from "../../assets/icons/unileverIcon";
import { useNavigate } from "react-router-dom";
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
          <div style={{ display: 'flex', gap: "1rem", alignItems: "center", textTransform: "capitalize" }}>
            <Avatar />Hello {`${userdata.first_name} ${userdata.last_name}`},
          </div>
          <Button variant="outlined" color="secondary" style={{ marginLeft: "auto" }} startIcon={<LogoutArrowIcon />} onClick={() => navigate("/logout")}>
            Logout
          </Button>
          <div style={{ fontSize: 64 }}>
            <UnileverIcon style={{ display: "block" }} />
          </div>
        </div>
      </header>
    </>
  );
}
