import { Link, useNavigate } from "react-router-dom";
import CategoryIcon from "../../assets/icons/categoryIcon";
import { Fragment, useContext, useEffect, useState } from "react";
import { Button, Divider, Step, StepButton, StepIcon, Stepper } from "@mui/material";
import CheckBoxRoundUnchecked from "../../assets/icons/checkBoxRoundUnchecked";
import CheckBoxRoundChecked from "../../assets/icons/checkBoxRoundChecked";
import PageIcon from "../../assets/icons/pageIcon";
import ArrowDownIcon from "../../assets/icons/arrowDownIcon";
import { ApplicationContext } from "./addApplication";
import LogoutArrowIcon from "../../assets/icons/logout_arrow";
import UserAddIcon from "../../assets/icons/userAdd";
import ConsumerIcon from "../../assets/icons/consumerIcon";
import MarketingIcon from "../../assets/icons/marketingIcon";
import AboutFragIcon from "../../assets/icons/aboutFragIcon";
import { collabActions, collabContext } from "../../context/collabContext";

export default function NavSideBar({ appId, activeQue }) {
  const navigate = useNavigate();
  const { catWiseQues, inputs } = useContext(ApplicationContext);
  const { collabDispatch } = useContext(collabContext);
  const [accOpen, setAccOpen] = useState(() => getInitialState(catWiseQues));
  const [activeSection, setActiveSection] = useState(0);


  const handleAccToggle = (e) => {
    const { name } = e.target;
    setAccOpen(prevState => ({ ...prevState, [name]: !prevState[name] }))
  }
  //** Effect For Section Open-Close onScroll */
  useEffect(() => {
    if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(activeQue)) {
      setAccOpen({ 1: true, 2: false, 3: false, 4: false });
      setActiveSection(0);
    } else if ([11, 12, 13, 14, 15].includes(activeQue)) {
      setAccOpen({ 1: false, 2: true, 3: false, 4: false })
      setActiveSection(11);
    } else if ([16, 17, 18, 19].includes(activeQue)) {
      setAccOpen({ 1: false, 2: false, 3: true, 4: false })
      setActiveSection(16);
    } else if ([20, 21, 22, 23, 24, 25, 26, 27, 28].includes(activeQue)) {
      setAccOpen({ 1: false, 2: false, 3: false, 4: true })
      setActiveSection(20);
    }
  }, [activeQue]);

  function BasicExample(queId, catId) {
    let nav;
    if(catId === 0) {
      //First Category
      nav = queId;
    } else {
      nav = (activeSection === catId) ? queId : catId;
    }
    // console.log({ queId, catId, activeSection, nav });
    const element = document.getElementById(nav);
    // console.log({ nav, element });
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <aside className="sidebar">
      <div className="navLinkContainer">
        <Link to='/dashboard'>
          <div className="linkIcon">
            <CategoryIcon />
            Dashboard
          </div>
        </Link>
        {catWiseQues.map((cat, catIndex) => (
          <Fragment key={catIndex}>
            <Divider />
            <button className="accordion" data-id={cat.serial} name={cat.category_id} onClick={handleAccToggle}>
              {getIconComp(cat.category_name)}{`${cat.category_id}. ${cat.category_name}`}<ArrowDownIcon className="accordionToggleIcon" pointerEvents="none" />
            </button>
            <div data-id={cat.serial} className={`panel ${accOpen[cat.category_id] ? 'open' : 'close'}`}>
              <Stepper nonLinear orientation="vertical">
                {cat.questions.map((que, queIndex) => (
                  <Step active={(que.serial === activeQue)} key={que.id}>
                    {/* <a href={`#${activeSection === cat.serial ? que.serial : cat.serial}`} className="navlink"> */}
                    <StepButton className={`navLink`} onClick={() => BasicExample(que.serial, cat.serial)} data-id={que.serial} icon={<StepIcon icon={getStepIcon(que, inputs)} />}>
                      <div data-id={que.serial} data-que-id={que.id} className="sidebarQueText">{`${cat.category_id}.${queIndex + 1} ${que.question}`}</div>
                    </StepButton>
                    {/* </a> */}
                  </Step>
                ))}
              </Stepper>
            </div>
          </Fragment>
        ))}
      </div>
      <div className="buttonContainer">
        <Button variant="contained" startIcon={<UserAddIcon />} onClick={() => collabDispatch({ type: collabActions.SHOW_COLLAB, payload: { app_id: appId } })}>Invite</Button>
        <Button variant="outlined" startIcon={<LogoutArrowIcon />} onClick={() => navigate('/logout')}>Logout</Button>
      </div>
    </aside>
  )
}

function getInitialState(catQue) {
  const result = {};
  // Object.keys(catQue).map((cat, i) => result[cat] = i ? false : true)
  // Object.keys(catQue).map((cat, i) => result[cat] = i ? true : true)
  catQue.forEach((cat, i) => result[cat.category_id] = i ? false : true);
  // console.log("ACC_STATUS: ", result);
  return result;
}


function getIconComp(name) {
  switch (name) {
    case "Overview":
      return <PageIcon />;
    case "About the Fragrance":
      return <AboutFragIcon />;
    case "About the Consumers":
      return <ConsumerIcon />;
    case "About the Investment":
      return <MarketingIcon />;
    default:
      return <PageIcon />;
  }
}

function getStepIcon(que, inputs) {
  let isCompleted = false;
  if (que.question_type_id === 12) {
    for (const childQue of que.nestedQue) {
      isCompleted = Boolean(inputs[childQue.id]);
      if (isCompleted) break;
    }

  } else {
    isCompleted = Boolean(inputs[que.id]);
  }

  return isCompleted ? <CheckBoxRoundChecked /> : <CheckBoxRoundUnchecked />
}
