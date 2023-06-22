import { Button } from '@mui/material'
import UnileverIcon from "../../assets/icons/unileverIcon";
import ArrowIcon from "../../assets/icons/arrowleft";
import CategoryIcon from "../../assets/icons/categoryIcon";
import { useNavigate } from "react-router-dom";
export default function FragranceBrief() {

  const navigate = useNavigate()
  return (
    <div className="overviewWrapper" style={{ backgroundImage: 'url("images/new_brief.png")' }}>
      <div className="overviewContainer">
        <div className="unilever-icon">
          <UnileverIcon />
        </div>
        <div className="btnTextContainer">
          <Button variant="contained" color="secondary" onClick={() => navigate("/dashboard")}>
            <div style={{ height: 32, width: 32, borderRadius: "50%", backgroundColor: "#FFFFFF33", display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 12 }}>
              <ArrowIcon />
            </div>
            <CategoryIcon style={{ marginLeft: 8, marginRight: 4 }} />
            Dashboard
          </Button>
          <h1>Give us an overview of<br />your fragrance brief</h1>
          <Button variant="contained" color="secondary" className="get_started" onClick={() => navigate("new")}>Get started</Button>
        </div>
      </div>
    </div>
  )
};