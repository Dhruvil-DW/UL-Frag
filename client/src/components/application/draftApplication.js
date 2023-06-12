import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import UnileverIcon from "../../assets/icons/unileverIcon";
import CategoryIcon from "../../assets/icons/categoryIcon";
import ArrowIcon from "../../assets/icons/arrowleft";

export default function DraftApplication() {
  const { state } = useLocation();
  console.log(state);
  const navigate = useNavigate();

  return (
    <div className="submitAppContainer" style={{ background: 'linear-gradient(90deg, hsl(258, 100%, 85%), hsl(258, 100%, 95%))' }}>

      <div className="unilever-icon">
        <UnileverIcon />
      </div>

      <div className="commonContainer">
        <div>
          <Button variant="contained" color="secondary" onClick={() => navigate("/dashboard")}>
            <ArrowIcon />
            <CategoryIcon />
            Dashboard
          </Button>
        </div>
        <h1 style={{ color: '#002F98', marginTop: "21vh" }}>Your Application has been saved!</h1>
        <div style={{ display: "flex", gap: 16 }}>
          <Button variant="contained" color="secondary" className="get_started" onClick={() => navigate(`/application/edit/${state.app_id}`)}>Edit</Button>
          <Button variant="contained" color="secondary" className="get_started" onClick={() => navigate(`/application/view/${state.app_id}`)}>View Brief</Button>
        </div>
      </div>

      {/* <img src="/images/golden_image.png" alt="golden" height="33%" style={{ position: 'absolute', right: '5%', bottom: '-5%' }} />
      <img src="/images/blue_image.png" alt="blue" height="22%" style={{ position: 'absolute', right: '-3%', bottom: '25%' }} />
      <img src="/images/lemon_image.png" alt="golden" height="33%" style={{ position: 'absolute', right: '-3%', bottom: '50%' }} />
      <img src="/images/blue_flower.png" alt="golden" height="40%" style={{ position: 'absolute', right: '13%', bottom: '30%' }} /> */}
      {/* <img src="/images/sparkle.png" alt="golden" width="125px" style={{position: 'absolute'}}/> */}

    </div>
  )
}
