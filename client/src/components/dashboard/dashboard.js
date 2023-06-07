import { useEffect, useState } from "react";
import Header from "../basic/header";
import { Button, Divider, InputAdornment, OutlinedInput, Tab, Tabs } from "@mui/material";
import { TabPanel } from "../../assets/tabs/tabs";
import MagnifierIcon from "../../assets/icons/magnifierIcon";
import { useNavigate } from "react-router-dom";
import UserIcon from "../../assets/icons/userIcon";
import CalenderIcon from "../../assets/icons/calenderIcon";
import { useAxios } from "../../hooks/useAxios";
import { formatDate } from "../../utils/globalFunctions/dateFns";

export default function Dashboard() {
  const navigate = useNavigate();
  const { getData } = useAxios();
  const [myAppData, setMyAppData] = useState([]);
  const [appData, setAppData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const handleChangeTab = (__event, newTab) => setSelectedTab(newTab);

  const [hoverCardId, setHoverCardId] = useState(null);
  const mouseEnter = (id) => setHoverCardId(id);
  const mouseExit = () => setHoverCardId(null);

  // useEffect(() => {
  //   const submitApp = JSON.parse(localStorage.getItem("submitApp")) ?? [];
  //   const staticData = createApplicationCardData(20);
  //   console.log({ submitApp });
  //   setMyAppData([...submitApp, ...staticData]);
  // }, [])

  function getMyApplication() {
    getData('user/getall/applications', {}, setMyAppData);
  }
  useEffect(getMyApplication, [getData]);

  function getApprovedApplication() {
    getData('user/getall/approve/applications', {}, setAppData);
  }
  useEffect(getApprovedApplication, [getData]);

  return (
    <section className="dashboardWrapper">
      <div className="dashboardContainer">
        <Header />
        <Divider sx={{ my: 2 }} />
        <div className="dashboardContentWrapper">
          <div className="tabContainer">
            <Tabs value={selectedTab} onChange={handleChangeTab} sx={{ mr: 'auto' }}>
              <Tab label="My projects" />
              <Tab label="All projects" />
            </Tabs>
            <OutlinedInput
              className="searchField"
              name="search"
              startAdornment=
              <InputAdornment position="start">
                <MagnifierIcon fill="#002F98" />
              </InputAdornment>
            />
            <Button variant="contained" color="secondary" onClick={() => navigate("/application")}>+ Create Application</Button>
          </div>
          <TabPanel value={selectedTab} index={0}>
            <FilterContainer type="myapp" />
            <div className="applicationCardContainer">
              {console.log(myAppData)}
              {myAppData.length > 0 ? myAppData.map((app, i) => (
                <div className="appCard" key={i} onMouseEnter={() => mouseEnter(i)} onMouseLeave={mouseExit}>
                  <h2>{app.project_name}</h2>
                  <div className="statusContainer">
                    <Button className="cardButton">{app.application_status.status}</Button>
                  </div>
                  <div className="cardDetails">
                    <UserIcon />
                    <p>{`${app.User.first_name} ${app.User.last_name}`}</p>
                  </div>
                  <div className="cardDetails">
                    <CalenderIcon />
                    <p>Edited on <b>{formatDate(app.updatedAt)}</b></p>
                  </div>
                  <img src="/images/icons/three_dot_blue.svg" alt="option" className="optionIcon" />
                  <div className={`appCardActionContainer ${hoverCardId === i ? "hovered" : ""}`}>
                    <img src="/images/icons/eye_round.svg" alt="view" onClick={() => navigate(`/application/view/${app.id}`)} />
                    <img src="/images/icons/copy_round.svg" alt="copy" />
                    {app.application_status_id === 1 && <img src="/images/icons/pencil_round.svg" alt="edit" onClick={() => navigate(`/application/edit/${app.id}`)} />}
                    <img src="/images/icons/invite_user.svg" alt="invite" />
                  </div>
                </div>
              )) : <p>No Application Found</p>}
            </div>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <FilterContainer type="all" />
            <div className="applicationCardContainer">
              {appData.length > 0 ? appData?.map((app, i) => (
                <div className="appCard" key={i} onMouseEnter={() => mouseEnter(i)} onMouseLeave={mouseExit}>
                  <h2>{app.title}</h2>
                  <div className="statusContainer">
                    <Button className="cardButton">Status</Button>
                  </div>
                  <div className="cardDetails">
                    <UserIcon />
                    <p>{app.name}</p>
                  </div>
                  <div className="cardDetails">
                    <CalenderIcon />
                    <p>Edited on <b>{app.modifiedDate}</b></p>
                  </div>
                  <img src="/images/icons/three_dot_blue.svg" alt="option" className="optionIcon" />
                  <div className={`appCardActionContainer ${hoverCardId === i ? "hovered" : ""}`}>
                    <img src="/images/icons/eye_round.svg" alt="view" />
                    <img src="/images/icons/copy_round.svg" alt="copy" />
                  </div>
                </div>
              )) : <p>No Application Found</p>}
            </div>
          </TabPanel>
        </div>
      </div>
    </section>
  )
}

function FilterContainer({ type = "my" }) {
  return (
    <div className="filterWrapper">
      <div className="filterContainer">
        {type !== 'all' && <OutlinedInput placeholder="Status" />}
        <OutlinedInput placeholder="Category" />
        <OutlinedInput placeholder="Date" />
      </div>
    </div>
  )
}

// function createApplicationCardData(count = 10) {
//   let result = [];
//   for (let i = 1; i <= count; i++) {
//     result.push({
//       title: `Fragrance Brief ${i}`,
//       name: "Andrew smith",
//       modifiedDate: "05/10/23",
//       status: "status"
//     })
//   }
//   return result;
// }