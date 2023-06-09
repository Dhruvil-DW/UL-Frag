import { Avatar, Button } from "@mui/material";
import UnileverIcon from "../../assets/icons/unileverIcon";
import { useNavigate } from "react-router-dom";
export default function Header() {
  const navigate = useNavigate();
  return (
    <>
      <header className="headerWrapper">
        <div className="headerContainer">
          <div style={{display:'flex', gap:"1rem"}}>
           <Avatar />
            </div>
          <div style={{ fontSize: 64 }}>
            <div>
              <Button variant="contained" style={{marginRight:38}} onClick={() => navigate("/logout")}>
                Logout
              </Button>
              <UnileverIcon />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
