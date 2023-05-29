import { Button, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowIcon from "../../assets/icons/arrowleft";
import { useNavigate } from "react-router-dom";
import UnileverIcon from "../../assets/icons/unileverIcon";

export default function SubmitApplication() {

    const navigate = useNavigate()
  return (
    <main className="appFormContainer">
      <aside className="sidebar">
        <div className="navLinkContainer">
          <Link to='/dashboard'>
            <div className="linkIcon">
              <p>Dashboard</p>
            </div>
          </Link>
          <Divider />
          <Link to='/dashboard'>
            <div>
              <p>Dashboard</p>
            </div>
          </Link>
          <Divider />
        </div>
        <div className="buttonContainer">
          <Button variant="contained">Invite</Button>
          <Button variant="outlined">Logout</Button>
        </div>
      </aside>
      <section id="form">
      <div className="unilever-icon">
          <UnileverIcon/>
        </div>
      {/* <div className="overviewContainer"> */}
        <div className="commonContainer">
            <div>
        <Button variant="contained" color="secondary"><ArrowIcon/>Back
        </Button>
            </div>
        <h1 style={{ color: '#002F98', marginTop: "21vh"}}>Your fragrance brief<br/>will be sent to CBFM <br/>for technical input</h1>
        <div>

        <Button variant="contained" color="secondary" className="get_started">View Brief</Button>
        </div>
        </div>
        <div className="imageWrapper">
        <img src="/images/blue_image.png" alt="blue" width="154vh" style={{position: 'absolute', marginTop: '-15vh', marginLeft:'65vh'}}/>
        <img src="/images/golden_image.png" alt="golden" width="300vh" style={{position: 'absolute', marginLeft:'33vh'}}/>
        <img src="/images/blue_flower.png" alt="golden" width="350vh" style={{position:'absolute', marginTop:'-45vh', marginLeft: '14vh'}}/>
        <img src="/images/lemon_image.png" alt="golden" width="314vh" style={{position: 'absolute', marginTop: '-55vh', marginLeft:'47vh'}}/>
        {/* <img src="/images/sparkle.png" alt="golden" width="125px" style={{position: 'absolute'}}/> */}

        </div>
        {/* <div className="commonContainer">
        <Button variant="contained" color="secondary" style={{marginTop: '10vh', marginLeft:-232}}><ArrowIcon/>Back
        </Button>
        <h1 style={{textAlign: 'left', paddingTop: '18vw', margin: 0, paddingRight: 200, color: '#002F98'}}>Your fragrance brief<br/>will be sent to CBFM <br/>for technical input</h1>
        <Button variant="contained" color="secondary" className="get_started" style={{marginLeft: -7, marginTop:12}}>View Brief</Button>
        </div> */}
      {/* </div> */}
      </section>
    </main>
  )
}
