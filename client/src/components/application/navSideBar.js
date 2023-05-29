import { Link } from "react-router-dom";
import CategoryIcon from "../../assets/icons/categoryIcon";
import { Fragment, useState } from "react";
import { Button, Divider, Step, StepButton, StepIcon, Stepper } from "@mui/material";
import CheckBoxRoundUnchecked from "../../assets/icons/checkBoxRoundUnchecked";
import CheckBoxRoundChecked from "../../assets/icons/checkBoxRoundChecked";
import PageIcon from "../../assets/icons/pageIcon";
import ArrowDownIcon from "../../assets/icons/arrowDownIcon";

export default function NavSideBar({ questionData, inputs, handleJump, scrollData }) {
  const [catWiseQue] = useState(() => getSidebarData(questionData));
  const [accOpen, setAccOpen] = useState(() => getInitialState(catWiseQue));
  const [currentQue, setCurrentQue] = useState(0);



  const handleAccToggle = (e) => {
    const { name } = e.target;
    setAccOpen(prevState => ({ ...prevState, [name]: !prevState[name] }))
    // debugger;
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
        {Object.keys(catWiseQue).map((cat, i) => (
          <Fragment key={i}>
            <Divider />
            <button className="accordion" name={cat} onClick={handleAccToggle}>{getIconComp(cat)}{cat ?? "N/A"}<ArrowDownIcon className="accordionToggleIcon" /></button>
            <div className={`panel ${accOpen[cat] ? 'open' : 'close'}`} >
              <Stepper nonLinear activeStep={currentQue} orientation="vertical">
                {catWiseQue[cat].map((que) => (
                  <Step key={que.id} active={que.no === currentQue}>
                    <StepButton className={`navLink ${scrollData.scrollTop <= (que.no * scrollData.scrollHeight) ? 'next' : 'prev'}`} onClick={() => handleJump("fixed", que.no)} icon={<StepIcon icon={inputs[que.id]?.length ? <CheckBoxRoundChecked /> : <CheckBoxRoundUnchecked />} />}>
                      {que.question}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </div>
          </Fragment>
        ))}
      </div>
      <div className="buttonContainer">
        <Button variant="contained">Invite</Button>
        <Button variant="outlined">Logout</Button>
      </div>
    </aside>
  )
}


function getSidebarData(questions) {
  const result = {};
  questions.forEach((que, index) => {
    if (result[que.Category.name]) {
      result[que.Category.name] = [...result[que.Category.name], { id: que.id, no: index, question: que.question }];
    } else {
      result[que.Category.name] = [{ id: que.id, no: index, question: que.question }];
    }
  });
  return result;
}

function getInitialState(catQue) {
  const result = {};
  Object.keys(catQue).map((cat, i) => result[cat] = i ? false : true)
  return result;
}

function getIconComp(name) {
  switch (name) {
    case "Overview":
      return <PageIcon />
    default:
      return <PageIcon />
  }
}
