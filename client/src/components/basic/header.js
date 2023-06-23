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
          <div style={{ display: 'flex', gap: "1rem", alignItems: "center", textTransform: "capitalize", color: "#7C8DB5", fontWeight: 400 }}>
            <Avatar sx={{ height: 48, width: 48 }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ marginTop: 16 }}>Hello {`${userdata.first_name} ${userdata.last_name}`},</div>
              <Button variant="text" onClick={() => navigate("/logout")}><LogoutArrowIcon style={{ fontSize: 16, marginRight: 4 }} />Logout</Button>
            </div>
          </div>
          <div style={{ fontSize: 64 }}>
            <UnileverIcon style={{ display: "block" }} />
          </div>
        </div>
      </header>
    </>
  );
}
