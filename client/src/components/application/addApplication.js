import { Button, Divider } from "@mui/material";
import { Link } from "react-router-dom";

export default function AddApplication() {

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
      </section>
      <div className='navBtnCont'>
        <button>Next</button>
        <button>Prev</button>
        <Button>Submit</Button>
      </div>
    </main>
  )
}
