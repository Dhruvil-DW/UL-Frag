import axios from "axios";
import { Button} from '@mui/material'
import UnileverIcon from "../../assets/icons/unileverIcon";
import ArrowIcon from "../../assets/icons/arrowleft";
import CategoryIcon from "../../assets/icons/categoryIcon";
import { useNavigate } from "react-router-dom";
export default function FragranceBrief() {

  const navigate = useNavigate()
  return (
    <div className="overviewWrapper"style={{ backgroundImage: 'url("images/overview_image.png")' }}>
      <div className="overviewContainer">
        <div className="unilever-icon">
          <UnileverIcon/>
        </div>
        <div className="newContainer">
        <Button variant="contained" color="secondary" style={{marginTop: 64, marginLeft:123}} onClick={() => navigate("/dashboard")}><ArrowIcon/><CategoryIcon/>Dashboard
        </Button>
        <h1 style={{textAlign: 'left', paddingTop: '18vw', margin: 0, paddingLeft: 121, color: '#002F98'}}>Give us an overview of<br/>your fragrance brief</h1>
        <Button variant="contained" color="secondary" className="get_started" style={{marginLeft: 117, marginTop:12}}  onClick={() => navigate("new")}>Get started</Button>
        </div>
      </div>
    </div>
  )
};