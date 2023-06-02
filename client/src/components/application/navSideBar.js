import { Link, useNavigate } from "react-router-dom";
import CategoryIcon from "../../assets/icons/categoryIcon";
import { Fragment, useContext, useState } from "react";
import { Button, Divider, Step, StepButton, StepIcon, Stepper } from "@mui/material";
import CheckBoxRoundUnchecked from "../../assets/icons/checkBoxRoundUnchecked";
import CheckBoxRoundChecked from "../../assets/icons/checkBoxRoundChecked";
import PageIcon from "../../assets/icons/pageIcon";
import ArrowDownIcon from "../../assets/icons/arrowDownIcon";
import { ApplicationContext } from "./addApplication";
import { childQuestionData } from "../../utils/globalData/questionData";

export default function NavSideBar({ questionData, inputs, activeQue }) {
  const navigate = useNavigate();
  const { handleNextPrevNav } = useContext(ApplicationContext);
  const [catWiseQue] = useState(() => getSidebarData(questionData));
  const [accOpen, setAccOpen] = useState(() => getInitialState(catWiseQue));
  // const [lastQueNo, setLastQueNo] = useState(() => getLastQue(catWiseQue));

  console.log({ catWiseQue, questionData });

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
            <div className={`panel ${accOpen[cat] ? 'open' : 'close'}`}>
              <Stepper nonLinear orientation="vertical">
                {catWiseQue[cat].map((que) => (
                  <Step key={que.id} active={que.no === activeQue}>
                    <StepButton className={`navLink`} onClick={() => handleNextPrevNav(que.no, "fixed")} icon={<StepIcon icon={getStepIcon(que, inputs)} />}>
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
        <Button variant="outlined" onClick={() => navigate('/logout')}>Logout</Button>
      </div>
    </aside>
  )
}


function getSidebarData(questions) {
  const result = {};
  questions.forEach((que, index) => {
    const childQue = que.question_type_id === 12 ? childQuestionData[que.id].map(obj => obj.id) : null;
    const queData = { id: que.id, no: index, question: que.question, question_type_id: que.question_type_id, child_que_id: childQue };
    if (result[que.Category.name]) {
      result[que.Category.name] = [...result[que.Category.name], queData];
    } else {
      result[que.Category.name] = [queData];
    }
  });
  return result;
}

function getInitialState(catQue) {
  const result = {};
  // Object.keys(catQue).map((cat, i) => result[cat] = i ? false : true)
  Object.keys(catQue).map((cat, i) => result[cat] = i ? true : true)
  return result;
}

// function getLastQue(catQue) {
//   const result = {};
//   Object.keys(catQue).forEach((cat, i) => {
//     // console.log({ cat, i, data: catQue[cat].pop().no });
//     result[catQue[cat].pop().no] = cat;
//   })
//   return result;
// }

function getIconComp(name) {
  switch (name) {
    case "Overview":
      return <PageIcon />
    default:
      return <PageIcon />
  }
}

function getStepIcon(que, inputs) {
  let isCompleted = false;

  if(que.question_type_id === 12) {
    for(const childQue of que.child_que_id) {
      isCompleted = Boolean(inputs[childQue]);
      if(isCompleted) break;
    }

  } else {
    isCompleted = Boolean(inputs[que.id]);
  }

  return isCompleted ? <CheckBoxRoundChecked /> : <CheckBoxRoundUnchecked />
}
