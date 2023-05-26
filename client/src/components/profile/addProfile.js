import { Button, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { authActions, authContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UnileverIcon from "../../assets/icons/unileverIcon";

export default function AddProfile() {
  const { authState, authDispatch } = useContext(authContext);
  const navigate = useNavigate();
  const { userdata, token } = authState;
  const [inputs, setInputs] = useState({ first_name: "", last_name: "", contact_no: "" });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  }

  function submitProfile() {
    if (userdata.role_id === 0) {
      axios
        .post('user/profile/add', inputs, { headers: { Authorization: "Bearer " + token } })
        .then((res) => {
          console.debug(res.data);
          authDispatch({ type: authActions.AUTH_SUCCESS, payload: res.data.token });
          navigate('/relevent-route');
        })
        .catch((err) => {
          console.debug(err);
        });
    } else {
      axios
        .put('user/profile/update', { headers: { Authorization: "Bearer " + token } })
        .then((res) => {
          console.debug(res.data);
        })
        .catch((err) => {
          console.debug(err);
        });
    }
  }

  return (
    <div className="loginWrapper" style={{ backgroundImage: 'url("images/login_image.png")' }}>
      <div className="loginContainer">
        <UnileverIcon fill="white" />
        <h1>Let's know about you more!</h1>
        <div className="formContainer">
          <TextField placeholder="First Name" name="first_name" value={inputs.first_name} onChange={handleInputChange} />
          <TextField placeholder="Last Name" name="last_name" value={inputs.last_name} onChange={handleInputChange} />
          <TextField placeholder="Contact No" name="contact_no" value={inputs.contact_no} onChange={handleInputChange} />
          <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={submitProfile}>{userdata.role_id === 0 ? "Submit" : "Update"}</Button>
            <Button variant="outlined" onClick={() => navigate('/logout')}>Logout</Button>
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  )
}
