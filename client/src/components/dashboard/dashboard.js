import { useContext, useEffect, useState } from "react";
import Header from "../basic/header";
import { Autocomplete, Button, Checkbox, Divider, InputAdornment, OutlinedInput, Tab, Tabs, TextField } from "@mui/material";
import { TabPanel } from "../../assets/tabs/tabs";
import MagnifierIcon from "../../assets/icons/magnifierIcon";
import { useNavigate } from "react-router-dom";
import UserIcon from "../../assets/icons/userIcon";
import CalenderIcon from "../../assets/icons/calenderIcon";
import { useAxios } from "../../hooks/useAxios";
import { formatDate } from "../../utils/globalFunctions/dateFns";
import { authContext } from "../../context/authContext";
import ArrowDownIcon from "../../assets/icons/arrowDownIcon";
import ErrorBoundary from "../../config/errorBoundary/ErrorBoundary";

export default function Dashboard() {
  const navigate = useNavigate();
  const { authState } = useContext(authContext);
  const userdata = authState.userdata;
  const { getData } = useAxios();
  const [myAppData, setMyAppData] = useState([]);
  const [appData, setAppData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const handleChangeTab = (__event, newTab) => setSelectedTab(newTab);

  const [hoverCardId, setHoverCardId] = useState(null);
  const mouseEnter = (id) => setHoverCardId(id);
  const mouseExit = () => setHoverCardId(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterInputs, setFilterInputs] = useState({status: [], answer: null});
  // useEffect(() => {
  //   const submitApp = JSON.parse(localStorage.getItem("submitApp")) ?? [];
  //   const staticData = createApplicationCardData(20);
  //   console.log({ submitApp });
  //   setMyAppData([...submitApp, ...staticData]);
  // }, [])
  // const categoryHandleChange = (__e, value) => {
  //   setFilterInputs((prevState) => ({ ...prevState, answer: value }))
  //   console.log("answer", value);
  // }
  // const handleChange = (__e, value) => {setFilterInputs((prevState) => ({ ...prevState, status: value }))};

  const handleFilterChange = (__event ,value ,__reason, name) => {
    setFilterInputs((prevState) => ({...prevState, [name]: value }))
  }
  const handleSearch = (e) => setSearch(e.target.value);
  // console.log("search", handleSearch);
  useEffect(() => {
    const delayFn = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delayFn);
  }, [search]);

  function getMyApplication() {
    const params = {'search': debouncedSearch, filters:filterInputs}
    getData('user/getall/applications', { params }, setMyAppData);
  }
  useEffect(getMyApplication, [getData, debouncedSearch, filterInputs]);

  function getApprovedApplication() {
    const params = {'search': debouncedSearch, filters:filterInputs}
    getData('user/getall/approve/applications', { params }, setAppData);
  }
  useEffect(getApprovedApplication, [getData, debouncedSearch, filterInputs]);

  return (
    <section className="dashboardWrapper">
      <div className="dashboardContainer">
        <Header />
        <Divider sx={{ my: 2 }} />
        <div className="dashboardContentWrapper">
          <div className="tabContainer">
            <Tabs value={selectedTab} onChange={handleChangeTab} sx={{ mr: 'auto' }}>
              <Tab label={userdata.role_id === 2 ? "Pending Projects" : "My Projects"} />
              <Tab label="All Projects" />
            </Tabs>
            <OutlinedInput
              className="searchField"
              name="search"
              placeholder="Search application"
              onChange={handleSearch}
              value={search}
              startAdornment=
              <InputAdornment position="start">
                <MagnifierIcon fill="#002F98" />
              </InputAdornment>
            />
            {userdata.role_id !== 2 && <Button variant="contained" color="secondary" onClick={() => navigate("/application")}>+ Create Application</Button>}
          </div>
          <TabPanel value={selectedTab} index={0}>
            <FilterContainer type="myapp" onChange={handleFilterChange} filterInputs={filterInputs} />
            <div className="applicationCardContainer">
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
                    {userdata.role_id === 1 && (
                      <>
                        {<img src="/images/icons/copy_round.svg" alt="copy" />}
                        {app.application_status_id === 1 && <img src="/images/icons/pencil_round.svg" alt="edit" onClick={() => navigate(`/application/edit/${app.id}`)} />}
                        {<img src="/images/icons/invite_user.svg" alt="invite" />}
                      </>
                    )}
                  </div>
                </div>
              )) : <p>No Application Found</p>}
            </div>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <FilterContainer type="all" onChange={handleFilterChange} filterInputs={filterInputs}/>
            <div className="applicationCardContainer">
              {appData.length > 0 ? appData?.map((app, i) => (
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
                    {userdata.role_id === 1 && <img src="/images/icons/copy_round.svg" alt="copy" />}
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
const APPLICATION_STATUS = ['Draft', 'Pending', 'Approved', 'Rejected'];
const QUESTION_CATEGORY = ['Fabric clean(FCL)', 'Fabric Enhancer(FEN)', 'Home & Hygiene(H&H)'];

function FilterContainer({ type = "my",  onChange, filterInputs}) {

  return (
    <ErrorBoundary>
      <div className="filterWrapper">
        <div className="filterContainer">
          {type !== 'all' && 
        // <OutlinedInput placeholder="Status" name="status"/>
        <Autocomplete
          multiple
          disableCloseOnSelect
          options={APPLICATION_STATUS}
          value={filterInputs.status ?? []}
          popupIcon={<ArrowDownIcon />}
          sx={{ width: 289 }}
          onChange={(event, value, reason) => onChange(event, value, reason, "status")}
          renderInput={(params) => <TextField {...params} variant="outlined" color="secondary" placeholder="Status" />}
          renderOption={(params, option, { selected }) => (
            <li {...params}>
              <Checkbox color="secondary" name="status" checked={selected} />
              {option}
            </li>
          )}
        />
        }

          <Autocomplete
          options={QUESTION_CATEGORY}
          value={filterInputs.answer ?? null}
          popupIcon={<ArrowDownIcon />}
          sx={{ width: 289 }}
          onChange={(event, value, reason) => onChange(event, value, reason, "answer")}
          renderInput={(params) => <TextField {...params} variant="outlined" color="secondary" placeholder="Category" />}
        />
        </div>
      </div>
    </ErrorBoundary>
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