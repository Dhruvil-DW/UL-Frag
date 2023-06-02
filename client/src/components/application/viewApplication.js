import React, { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { childQuestionData, questionsData } from '../../utils/globalData/questionData';
import CategoryIcon from '../../assets/icons/categoryIcon';
import UserIcon from '../../assets/icons/userIcon';
import CalenderIcon from '../../assets/icons/calenderIcon';
import PageIcon from '../../assets/icons/pageIcon';
const submitApp = JSON.parse(localStorage.getItem("submitApp"));

export default function ViewApplication() {
  const { appId } = useParams();
  const [appData] = useState(submitApp.find(({ app_id }) => app_id === appId));

  console.log(appData);
  if (!appData) {
    return <Navigate to='/dashboard' />
  }

  return (
    <div className='appFormContainer'>
      <div className='sidebar viewSidebar'>
        <div className="navLinkContainer">
          <Link to='/dashboard'>
            <div className="linkIcon">
              <CategoryIcon />
              Dashboard
            </div>
          </Link>
          <h2 style={{ textAlign: "center" }}>{appData.title ?? "N/A"}</h2>
          <p className='viewSidebarIconText'><PageIcon />{appData.app_id ?? "N/A"}</p>
          <p className='viewSidebarIconText'><UserIcon />{appData.name ?? "N/A"}</p>
          <p className='viewSidebarIconText'><CalenderIcon />{appData.modifiedDate ?? "N/A"}</p>
        </div>
      </div>
      <div className='QAWrapper'>
        {questionsData.map((question, index) => (
          question.question_type_id === 12
            ? <NestedQueAns key={question.id} index={index + 1} que={question} appInputs={appData.inputs} />
            : <QueAns key={question.id} index={index + 1} que={question} ansData={appData.inputs[question.id]} />
        ))}
      </div>
    </div>
  )
}

function QueAns({ que, index, ansData }) {
  return (
    <div className='QAContainer'>
      <h3>{index ? `${index}. ` : ""}{que.question}</h3>
      <div className='answerContainer'>
        <GetAnswer answer={ansData} queId={que.id} />
      </div>
    </div>
  )
}

function NestedQueAns({ que, index, appInputs }) {
  const childQue = childQuestionData[que.id];
  console.log(childQue);

  return (
    <div className='QAContainer'>
      <h3>{`${index}. `}{que.question}</h3>
      <div className='nestedConteiner'>
        {childQue.map(question => <QueAns key={question.id} que={question} ansData={appInputs[question.id]} />)}
      </div>
    </div>
  )
}

function GetAnswer({ answer, queId }) {
  if (typeof answer === 'string') {
    return <p>{answer}</p>;
  } else if (Array.isArray(answer)) {
    return (
      <ol>
        {answer.map((ans, index) => <li key={index}>{ans}</li>)}
      </ol>
    )
  } else if (typeof answer === 'object') {
    switch (queId) {
      case 8:
        return (
          <div>
            <img src={`/images/${answer.brand}`} alt="Brand" />
            <p>{answer.desc}</p>
          </div>
        )
      default:
        return (<p>{JSON.stringify(answer)}</p>)
    }
  }
}