import axios from "axios";
import { useContext, useState } from "react";
import { authActions, authContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from '@mui/material'
import UnileverIcon from "../../assets/icons/unileverIcon";

export default function Login() {
  const { authDispatch } = useContext(authContext);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ email: "", otp: "" });
  const [step, setStep] = useState(1);
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
        console.debug(res.data);
        setOtpStatus({ isSend: true, isError: false, msg: `${res.data.message}` });
        setStep(2);
      })
      .catch((err) => {
        console.debug(err);
        setOtpStatus({ isSend: false, isError: true, msg: `Server Error! Try Again` });
      })
  }

  function submitOTP() {
    axios
      .post('auth/verifyotp', inputs)
      .then((res) => {
        const token = res.data.token;
        console.debug({ token });
        setAuthStatus({ isAuth: true, msg: "Enter OTP" });
        authDispatch({ type: authActions.AUTH_SUCCESS, payload: { token } });
        navigate('./relevent_route');
      })
      .catch((err) => {
        authDispatch({ type: authActions.AUTH_FAILED });
        setAuthStatus({ isAuth: false, msg: err.response?.data?.message ?? "OTP is Invalid!" })
        console.debug(err);
      })
  }

  function handleKeyUp(event) {
    // console.log("KEY_UP...", event);
    const key = event.key;
    const name = event.target.name;

    switch (name) {
      case 'email':
        if (key === "Enter") sendOTP();
        return;
      case 'otp':
        if (key === "Enter") submitOTP();
        return;
      default:
        return;
    }
  }

  return (
    <div className="loginWrapper" style={{ backgroundImage: 'url("images/login_image.png")' }}>
      <div className="loginContainer">
        <UnileverIcon fill="white" />
        <h1>We create a fragrant world!</h1>
        <div className="formContainer">
          <TextField variant="outlined" color="primary" placeholder="Email" name="email" value={inputs.email} onChange={handleInputChange} onKeyUp={handleKeyUp} autoFocus />
          <TextField variant="outlined" color="primary" placeholder='OTP' name="otp" value={inputs.otp} onChange={handleInputChange} error={!authStatus.isAuth} helperText={authStatus.msg} onKeyUp={handleKeyUp} />
          <div style={{ marginTop: '1em', display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={sendOTP}>{step === 1 ? "Send OTP" : step === 2 ? "Resend OTP" : "Invalid Step"}</Button>
            <Button variant="contained" onClick={submitOTP}>Submit</Button>
          </div>
          <div className="helperText" style={{ marginLeft: 'auto' }}>{otpStatus.msg}</div>
          <div>
          </div>
        </div>
      </div>
    </div>
  )
};