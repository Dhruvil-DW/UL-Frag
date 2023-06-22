import { useContext, useEffect, useState } from "react";
import Header from "../basic/header";
import { Button, Divider, InputAdornment, OutlinedInput, Tab, Tabs } from "@mui/material";
import { TabPanel } from "../../assets/tabs/tabs";
import MagnifierIcon from "../../assets/icons/magnifierIcon";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../hooks/useAxios";
import { authContext } from "../../context/authContext";
import MyProjectTab from "./tabs/myProjectTab";
import AllProjectTab from "./tabs/allProjectTab";
import InviteTab from "./tabs/inviteTab";
import { promptActions, promptContext } from "../../context/promptContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { authState } = useContext(authContext);
  const userdata = authState.userdata;
  const { promptDispatch } = useContext(promptContext);
  const { getData } = useAxios();
  const [selectedTab, setSelectedTab] = useState(0);
  const handleChangeTab = (__event, newTab) => setSelectedTab(newTab);
  
  //**** My Application Data Start ****//
  const [myAppData, setMyAppData] = useState([]);
  const [myAppParams, setMyAppParams] = useState({ search: "", filters: { status: [], answer: null }});
  const [myAppParamsDebounced, setMyAppParamsDebounced] = useState(myAppParams);
  
  const handleMyAppFilterChange = (__event, value, __reason, name) => {
    setMyAppParams((prevState) => ({ ...prevState, filters: { ...prevState.filters, [name]: value } }))
  }

  useEffect(() => {
    const delayFn = setTimeout(() => setMyAppParamsDebounced(myAppParams), 500);
    return () => clearTimeout(delayFn);
  }, [myAppParams]);

  function getMyApplication() {
    const params = myAppParamsDebounced;
    getData('user/get/myapplications', { params }, setMyAppData);
  }
  useEffect(getMyApplication, [getData, myAppParamsDebounced]);

  //**** My Application Data End ****//

  //**** All Application Data Start ****//
  const [allAppData, setAllAppData] = useState([]);
  const [allAppParams, setAllAppParams] = useState({ search: "", filters: { answer: null } });
  const [allAppParamsDebounced, setAllAppParamsDebounced] = useState(allAppParams);

  const handleAllAppFilterChange = (__event, value, __reason, name) => {
    setAllAppParams((prevState) => ({ ...prevState, filters: { ...prevState.filters, [name]: value } }))
  }

  useEffect(() => {
    const delayFn = setTimeout(() => setAllAppParamsDebounced(allAppParams), 500);
    return () => clearTimeout(delayFn);
  }, [allAppParams]);

  function getAllApplication() {
    const params = allAppParamsDebounced;
    getData('user/get/approvedapplications', { params }, setAllAppData);
  }
  useEffect(getAllApplication, [getData, allAppParamsDebounced]);

  //**** All Application Data End ****//

  //**** Invited Application Data Start ****//
  const [invitedAppData, setInvitedAppData] = useState([]);
  const [invitedAppParams, setInvitedAppParams] = useState({ search: "", filters: { answer: null } });
  const [invitedAppParamsDebounced, setInvitedAppParamsDebounced] = useState(invitedAppParams);

  const handleinvitedAppFilterChange = (__event, value, __reason, name) => {
    setInvitedAppParams((prevState) => ({ ...prevState, filters: { ...prevState.filters, [name]: value } }))
  }

  useEffect(() => {
    const delayFn = setTimeout(() => setInvitedAppParamsDebounced(invitedAppParams), 500);
    return () => clearTimeout(delayFn);
  }, [invitedAppParams]);

  function getinvitedApplication() {
    if (userdata.role_id !== 2) {
      const params = invitedAppParamsDebounced;
      getData('user/get/invitedapplications', { params }, setInvitedAppData);
    }
  }
  useEffect(getinvitedApplication, [getData, invitedAppParamsDebounced, userdata.role_id]);
  //**** Invited Application Data End ****//

  const handleSearch = (e) => {
    if (selectedTab === 0) setMyAppParams((prevSearch) => ({ ...prevSearch, search: e.target.value }))
    if (selectedTab === 1) setAllAppParams((prevSearch) => ({ ...prevSearch, search: e.target.value }))
    if (selectedTab === 2) setInvitedAppParams((prevSearch) => ({ ...prevSearch, search: e.target.value }))
  };

  const handleEditApp = (appId, event) => {
    event.stopPropagation();
    getData(`application/edit/${appId}`, {},
      (data) => {
        if (data.canEdit) {
          navigate(`/application/edit/${appId}`);
        } else {
          promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: data.message } });
        }
      }
    );
  }
  return (
    <section className="dashboardWrapper">
      <div className="dashboardContainer">
        <Header />
        <Divider sx={{ marginTop:'55px' }} />
        <div className="dashboardContentWrapper">
          <div className="tabContainer">
            <Tabs value={selectedTab} onChange={handleChangeTab} sx={{ mr: 'auto' }}>
              <Tab label={userdata.role_id === 2 ? "In Approval Projects" : "My Projects"} sx={{ fontWeight:500 }}/>
              <Tab label="All Projects" />
              {userdata.role_id === 1 && <Tab label="Invited Projects" />}
            </Tabs>
            <OutlinedInput
              className="searchField"
              name="search"
              placeholder="Search application"
              onChange={handleSearch}
              value={selectedTab === 0 ? myAppParams.search : selectedTab === 1 ? allAppParams.search : selectedTab === 2 ? invitedAppParams.search : ""}
              startAdornment=
              <InputAdornment position="start">
                <MagnifierIcon fill="#002F98" />
              </InputAdornment>
            />
            {userdata.role_id !== 2 && <Button variant="contained" color="secondary" onClick={() => navigate("/application")} sx={{fontWeight: 400}}>+ Create Application</Button>}
          </div>
          <TabPanel value={selectedTab} index={0}>
            <MyProjectTab data={myAppData} params={myAppParams} handleParamsChange={handleMyAppFilterChange} handleEditApp={handleEditApp} />
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <AllProjectTab data={allAppData} params={allAppParams} handleParamsChange={handleAllAppFilterChange} />
          </TabPanel>
          {userdata.role_id === 1 && (
            <TabPanel value={selectedTab} index={2}>
              <InviteTab data={invitedAppData} params={invitedAppParams} handleParamsChange={handleinvitedAppFilterChange} handleEditApp={handleEditApp} />
            </TabPanel>
          )}
        </div>
      </div>
        <img src="/images/blue_flower.png" alt="blue" height="20%" style={{ position: 'fixed', left: '-5%', bottom: '-3%' }} />
        <img src="/images/golden_image.png" alt="golden" height="20%" style={{ position: 'fixed', right: '-3%', bottom: '-5%' }} />
    </section>
  )
}