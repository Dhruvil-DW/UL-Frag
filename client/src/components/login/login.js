import axios from "axios";
import { useContext, useState } from "react";
import { authActions, authContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from '@mui/material'
import UnileverIcon from "../../assets/icons/unileverIcon";

export default function Login() {
  const [inputs, setInputs] = useState({ email: "", otp: "" });
  const { authDispatch } = useContext(authContext);
  const navigate = useNavigate();
  const [otpStatus, setOtpStatus] = useState({ isSend: false, isError: false, msg: '' });
  const [authStatus, setAuthStatus] = useState({ isAuth: true, msg: 'Enter OTP' });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  }

  function sendOTP() {
    axios
      .post('auth/sendotp', { email: inputs.email })
      .then((res) => {
        console.log(res.data);
        setOtpStatus({ isSend: true, isError: false, msg: `${res.data.message}` });
      })
      .catch((err) => {
        console.log(err);
        setOtpStatus({ isSend: false, isError: true, msg: `Server Error! Try Again` });
      })
  }

  function submitOTP() {
    axios
      .post('auth/verifyotp', inputs)
      .then((res) => {
        const token = res.data.token;
        console.log({ token });
        setAuthStatus({ isAuth: true, msg: "Enter OTP" });
        authDispatch({ type: authActions.AUTH_SUCCESS, payload: { token } });
        navigate('./relevent_route');
      })
      .catch((err) => {
        authDispatch({ type: authActions.AUTH_FAILED });
        setAuthStatus({ isAuth: false, msg: err.response?.data?.message ?? "OTP is Invalid!" })
        console.log(err);
      })
  }

  return (
    <div className="loginWrapper" style={{ backgroundImage: 'url("images/login_image.png")' }}>
      <div className="loginContainer">
        <UnileverIcon fill="white" />
        <h1>We create a fragrant world!</h1>
        <div className="formContainer">
          <TextField placeholder="Email" name="email" value={inputs.email} onChange={handleInputChange} />
          <div>
            <Button variant="contained" onClick={sendOTP}>Send OTP</Button><span className="helperText" style={{ marginLeft: '0.75rem' }}>{otpStatus.msg}</span>
          </div>
          <TextField placeholder='OTP' name="otp" value={inputs.otp} onChange={handleInputChange} error={!authStatus.isAuth} disabled={!otpStatus.isSend} helperText={authStatus.msg} />
          <div style={{ marginTop: '1em' }}>
            <Button variant="contained" onClick={submitOTP} disabled={!otpStatus.isSend}>Submit</Button>
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  )
};