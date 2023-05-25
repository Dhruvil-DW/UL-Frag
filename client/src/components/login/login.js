import axios from "axios";
import { useContext, useState } from "react";
import { authActions, authContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [inputs, setInputs] = useState({ email: "", otp: "" });
  const { authState, authDispatch } = useContext(authContext);
  const navigate = useNavigate();

  function handleInputChange(e) {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  }

  function sendOTP() {
    axios
      .post('auth/sendotp', { email: inputs.email })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }
  function submitOTP() {
    axios
      .post('auth/verifyotp', inputs)
      .then((res) => {
        const token = res.data.token;
        console.log({ token });
        authDispatch({ type: authActions.AUTH_SUCCESS, payload: { token } });
        navigate('./dashboard');
      })
      .catch((err) => {
        authDispatch({ type: authActions.AUTH_FAILED });
        console.log(err);
      })
  }

  return (
    <div className="loginWrapper" style={{ backgroundImage: 'url("images/login_image.png")' }}>
      <div className="loginContainer">
        <div>Login Page</div>
        <div>
          <div>
            <label htmlFor="email">Email ID: </label>
            <input type="text" id="email" name="email" value={inputs.email} onChange={handleInputChange} />
            <button onClick={sendOTP}>Send OTP</button>
          </div>
          <div>
            <label htmlFor="otp">OTP: </label>
            <input type="text" id="otp" name="otp" value={inputs.otp} onChange={handleInputChange} />
          </div>
          <div>
            <button onClick={submitOTP}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
};