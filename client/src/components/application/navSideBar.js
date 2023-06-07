import { Link, useNavigate } from "react-router-dom";
import CategoryIcon from "../../assets/icons/categoryIcon";
import { Fragment, useContext, useState } from "react";
import { Button, Divider, Step, StepButton, StepIcon, Stepper } from "@mui/material";
import CheckBoxRoundUnchecked from "../../assets/icons/checkBoxRoundUnchecked";
import CheckBoxRoundChecked from "../../assets/icons/checkBoxRoundChecked";
import PageIcon from "../../assets/icons/pageIcon";
import ArrowDownIcon from "../../assets/icons/arrowDownIcon";
import { ApplicationContext } from "./addApplication";
import { useAxios } from "../../hooks/useAxios";

export default function NavSideBar({ activeQue }) {
  const navigate = useNavigate();
  const { catWiseQues, inputs, handleNextPrevNav } = useContext(ApplicationContext);
  const [accOpen, setAccOpen] = useState(() => getInitialState(catWiseQues));
  // const [lastQueNo, setLastQueNo] = useState(() => getLastQue(catWiseQues));
  
  const handleAccToggle = (e) => {
    const { name } = e.target;
    setAccOpen(prevState => ({ ...prevState, [name]: !prevState[name] }))
  }

  console.log("accOpen: ", accOpen);
  let count = 0;
  return (
    <aside className="sidebar">
      <div className="navLinkContainer">
        <Link to='/dashboard'>
          <div className="linkIcon">
            <CategoryIcon />
            Dashboard
          </div>
        </Link>
        {catWiseQues.map((cat, i) => (
          <Fragment key={i}>
            <Divider />
            <button className="accordion" id={count} name={cat.category_id} onClick={handleAccToggle}>{getIconComp(cat)}{cat.category_name ?? "N/A"}<ArrowDownIcon className="accordionToggleIcon" /></button>
            <div data-id={count++} className={`panel ${accOpen[cat.category_id] ? 'open' : 'close'}`}>
              <Stepper nonLinear orientation="vertical">
                {cat.questions.map((que) => (
                  <Step key={que.id}>
                    {/* <StepButton className={`navLink`} onClick={() => handleNextPrevNav(que.id, "fixed")} icon={<StepIcon icon={getStepIcon(que, inputs)} />}>
                      <div className="sidebarQueText">{que.question}</div>
                    </StepButton> */}
                    <a href={`#${count}`} className="navlink">
                    <StepButton className={`navLink`} icon={<StepIcon icon={getStepIcon(que, inputs)} />}>
                      <div data-id={count++} data-que-id={que.id} className="sidebarQueText">{que.question}</div>
                    </StepButton>
                    </a>
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


// function getSidebarData(questions) {
//   const result = [];
//   questions.forEach((que, index) => {
//     const childQue = que.question_type_id === 12 ? childQuestionData[que.id].map(obj => obj.id) : null;
//     const queData = { id: que.id, no: index, question: que.question, question_type_id: que.question_type_id, child_que_id: childQue };
//     if (result[que.Category.name]) {
//       result[que.Category.name] = [...result[que.Category.name], queData];
//     } else {
//       result[que.Category.name] = [queData];
//     }
//   });
//   return result;
// }

function getSidebarData(questions) {
  const result = [];
  questions.forEach((que, index) => {
    if (result[que.Category.id - 1]) {
      result[que.Category.id - 1].questions = [...result[que.Category.id - 1].questions, que];
    } else {
      result[que.Category.id - 1] = { category_id: que.Category.id, category_name: que.Category.name, questions: [que] }
    }
  });
  // console.log("Sidebar_CatWiseData: ", result);
  return result;
}

function getInitialState(catQue) {
  const result = {};
  // Object.keys(catQue).map((cat, i) => result[cat] = i ? false : true)
  // Object.keys(catQue).map((cat, i) => result[cat] = i ? true : true)
  catQue.forEach((cat, i) => result[cat.category_id] = i ? false : true);
  // console.log("ACC_STATUS: ", result);
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
