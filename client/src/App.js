import Login from "./components/login/login";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Redirect } from "./config/routes";
import Dashboard from "./components/dashboard/dashboard";
import AddProfile from "./components/profile/addProfile";
import Logout from "./components/login/logout";
import AddApplication from "./components/application/addApplication";
import FragranceBrief from './components/fragranceBrief/fragranceBrief'
import SubmitApplication from "./components/application/submitApplication";
import ViewApplication from "./components/application/viewApplication";
import DraftApplication from "./components/application/draftApplication";
import { useContext } from "react";
import { authContext } from "./context/authContext";

export default function App() {
  const { authState } = useContext(authContext);
  const token = authState.token;
  const userdata = authState.userdata;

  // console.log(userdata)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Redirect />} />
        <Route path="/*" element={<Navigate to="/" />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        
        {/* New User */}
        {token && userdata?.role_id === 0 && <Route path="/profile" element={<AddProfile />} />}

        {/* User */}
        {token && userdata?.role_id === 1 && (
          <>
            <Route path="/profile" element={<AddProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/application">
              <Route index element={<FragranceBrief />} />
              <Route path="new" element={<AddApplication />} />
              <Route path="summary" element={<SubmitApplication />} />
              <Route path="drafted" element={<DraftApplication />} />
              <Route path="view/:appId" element={<ViewApplication />} />
              <Route path="edit/:appId" element={<AddApplication />} />
            </Route>
          </>
        )}

        {/* Aproval Authority */}
        {token && userdata?.role_id === 2 && (
          <>
            <Route path="/profile" element={<AddProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/application">
              <Route path="view/:appId" element={<ViewApplication />} />
            </Route>
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

