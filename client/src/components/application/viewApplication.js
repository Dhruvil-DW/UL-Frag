import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CategoryIcon from '../../assets/icons/categoryIcon';
import UserIcon from '../../assets/icons/userIcon';
import CalenderIcon from '../../assets/icons/calenderIcon';
import PageIcon from '../../assets/icons/pageIcon';
import { useAxios } from '../../hooks/useAxios';
import { formatDate } from '../../utils/globalFunctions/dateFns';
import { Button } from '@mui/material';
import { authContext } from '../../context/authContext';
import { promptActions, promptContext } from '../../context/promptContext';
import { LazyImage } from '../../assets/image/lazyImage';
import LogoutArrowIcon from "../../assets/icons/logout_arrow";
import UserAddIcon from "../../assets/icons/userAdd";
import { collabActions, collabContext } from '../../context/collabContext';
import { useListCollab } from '../collaborator/collabAPI';
import { useGetQuestions } from './addAppAPIs';

export default function ViewApplication() {
  const { appId } = useParams();
  const { getData, updateData } = useAxios();
  const navigate = useNavigate();
  const { authState } = useContext(authContext);
  const { promptDispatch } = useContext(promptContext);
  const { collabDispatch } = useContext(collabContext);
  const userdata = authState.userdata;

  const [appData, setAppData] = useState({});
  const [queAns, setQueAns] = useState([]);
  const [result, setResult] = useState([]);
  //console.log("QuesAns", queAns);
  const listOfCollab = useListCollab(appId);
  const questions = useGetQuestions();
  //console.log(questions.data);

  useEffect(() => {
    if (questions.data && queAns.length) {
      const finalResult = [];
      questions.data.forEach((cat) => {
        const questionWithAns = [];
        cat.questions.forEach((que) => {
          if(que.question_type_id === 12) {
            debugger;
            const answer = queAns
            .filter((qa) => [que.id + 1, que.id + 2, que.id + 3 ].includes(qa.question_id))
            .map(obj => ({ question_id: obj.question_id, answer: obj.answers[0].answer }))
            if (answer) {
              questionWithAns.push({ ...que, answers: answer });
            }
          } else {
            const answer = queAns.find((qa) => qa.question_id === que.id);
            if (answer) {
              questionWithAns.push({ ...que, answers: answer.answers });
            }
          }
        })
        if (questionWithAns.length) {
          finalResult.push({ ...cat, questions: questionWithAns });
        }
      })
      setResult(finalResult);
      //console.log(finalResult);
    }
  }, [questions.data, queAns]);
  
  function getAppQuestions() {
    getData(`user/viewapplication/${appId}`, {},
      (data) => {
        setAppData(data.Application);
        setQueAns(data.QueAns);
        //console.log("Question", data.QueAns[0].answers);
      },
      () => {
        navigate("/dashboard");
      });
  }
  useEffect(getAppQuestions, [navigate, getData, appId]);

  function handleApprove() {
    updateData(`authority/application/${appId}/Approved`, {}, (data) => {
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: data.message, type: "success", timer: 4000 } });
      navigate("/dashboard");
    });
  }

  function handleReject() {
    updateData(`authority/application/${appId}/Rejected`, {}, (data) => {
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: data.message, type: "success", timer: 4000 } });
      navigate("/dashboard");
    });
  }
// console.log("resultqueans", result[0].category_name);
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
          <div className='detailsContainer' style={{ marginTop: 38 }}>
            {/* <h2 style={{ textAlign: "center" }}>{appData.project_name ?? "N/A"}</h2> */}
            <h2 style={{ marginLeft: "2rem", maxWidth: 250, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", fontWeight: 400 }}>{appData.project_name ?? "N/A"}</h2>
            {/* <p className='viewSidebarIconText'><PageIcon />{appData.application_status?.status ?? "N/A"}</p> */}
            <Button variant='outlined' sx={{ marginLeft: '2rem' }}>{appData.application_status?.status ?? "N/A"}</Button>
            <p style={{ marginLeft: '2rem' }}>{queAns.find((item) => item.question_id === 3)?.answers[0]?.answer ?? "N/A"}</p>
            <p className='viewSidebarIconText'><UserIcon />{`${appData.User?.first_name ?? "N/A"} ${appData.User?.last_name ?? ""}`}</p>
            <p className='viewSidebarIconText'><CalenderIcon />{formatDate(appData.updated_at) ?? "N/A"}</p>
          </div>
          {Boolean(listOfCollab.data?.length) && (
            <div style={{ height: "calc(100% - 300px)", overflowY: "auto" }}>
              <h3 className='viewSidebarIconText'><UserAddIcon />Collaborators</h3>
              {listOfCollab.data?.map((obj, i) => (
                <p key={i} className='viewSidebarIconText'>
                  <UserAddIcon />
                  <div style={{ maxWidth: 220, textOverflow: "ellipsis", overflow: "hidden" }}>{obj.User.email}</div>
                </p>
              ))}
            </div>
          )}
        </div>
        {userdata.role_id === 2 && appData.application_status_id === 2 && (
          <>
            <div className="buttonContainer" style={{ margin: "1rem" }}>
              <Button variant="outlined" onClick={handleApprove}>Approve</Button>
              <Button variant="outlined" onClick={handleReject}>Reject</Button>
            </div>
          </>
        )}
        {userdata.role_id === 1 && (
          <>
            {/* <div className="buttonContainer" style={{ margin: "1rem", alignSelf: "flex-start" }}>
              <Button variant="outlined" onClick={() => navigate('/logout')}>Logout</Button>
            </div> */}
            <div className="buttonContainer">
              {appData.application_status_id === 1 && <Button variant="contained" startIcon={<UserAddIcon />} onClick={() => collabDispatch({ type: collabActions.SHOW_COLLAB, payload: { app_id: appId } })}>Invite</Button>}
              <Button variant="outlined" startIcon={<LogoutArrowIcon />} onClick={() => navigate('/logout')}>Logout</Button>
            </div>
          </>
        )}
      </div>
      <div className='QAWrapper'>
        {/* {queAns.map((qa, index) => <QueAns key={qa.id} index={index + 1} qa={qa} />)} */}
        {result.map((cat) => <NewQuesAns category={cat} />)}
      </div>
    </div>
  )
}
// old function ---start--------
// function QueAns({ qa, index }) {
//   //console.log("QA: ", qa);
//   // ans.map((ans, i) => console.log("answer", ans.answer));
//   return (
//     <>
//       {/* <div className='QACategory'>
//     {qa.category.name}
//     </div> */}
//       <div className='QAContainer'>
//         {/* <h3>{index ? `${index}. ` : ""}{qa.question?.question ?? "N/A"}</h3> */}
//         <h3>{index ? `${index}. ` : ""}{qa.question}</h3>
//         <div className='answerContainer'>
//           <GetAnswer qa={qa} />
//         </div>
//       </div>
//     </>
//   )
// }
// old function ---end----

function NewQuesAns({category}){
  console.log(category);
  return (
    <div className='QAContainer'>
    <div className='rectangle'>
  <h3 className='categoryTxt'>{category.category_id}. {category.category_name}</h3>
    </div>
  {category.questions.map((que)=> 
  // console.log("answers", que.answers)
    <>
      <h4>{`${que.CatWiseQueIndex} ${que.question}`}</h4>
      <div className='answerContainer'>
        
        <GetNewAnswer ans={que}/>
      </div>
      </>
  )}
  </div>

  )
}

 
// function NestedQueAns({ que, index, appInputs }) {
//   const childQue = que.nestedQue;
//   // console.log(childQue);

//   return (
//     <div className='QAContainer'>
//       <h3>{`${index}. `}{que.question}</h3>
//       <div className='nestedConteiner'>
//         {childQue.map(question => <QueAns key={question.id} que={question} ansData={appInputs[question.id]} />)}
//       </div>
//     </div>
//   )
// }

// old function for getting answers --start----
// function GetAnswer({ qa }) {
//   //console.log("QA: ", qa.answers[0].answer);
//   switch (qa) {
//     case 1: // TextBox
//       // console.log(qa.answers);
//       return qa.answers.map((ans, i) => <p key={i}>{ans.answer}</p>);

//     case 3: //Select Dropdown predefined
//     case 4: // Select Dropdown dynamic
//       // console.log(qa)app_questions.answers.;
//       return qa.answers.map((ans, i) => <p key={i}>{ans.answer}</p>)

//     case 5: //Multiselect Dropdown predefined
//     case 6: // Multiselect dropdown dynamic
//       // console.log(qa)app_questions.answers.;
//       return qa.answers.map((ans, i) => <p key={i}>{ans.answer}</p>)

//     case 14: //Select (projectName) with TextBox
//       return qa.answers.map((ans, i) => {
//         const ansObj = JSON.parse(ans.answer);
//         return (
//           <Fragment key={i}>
//             <p>{ansObj.option}</p>
//             <p>{ansObj.projectName}</p>
//           </Fragment>)
//       });

//     case 7: // Picture Choice predefined
//       return qa.answers.map((ans, i) => {
//         const ansObj = JSON.parse(ans.answer);
//         return (
//           <Fragment key={i}>
//             <img src={`/images/${ansObj.brand}`} alt={ansObj.brand} />
//             {ansObj.desc && <p>{ansObj.desc}</p>}
//           </Fragment>)
//       });

//     case 13: // Add Multiple section Image Upload
//       return qa.answers.map((ans, i) => {
//         const ansObj = JSON.parse(ans.answer);
//         return (
//           <Fragment key={i}>
//             {ansObj.desc && <p><b>{ansObj.desc}</b></p>}
//             <div style={{ display: 'flex', alignItems: 'center', gap: '3em' }}>
//               {ansObj.files.map((img) => (
//                 <LazyImage name={img} style={{ width: '10vw' }} />
//               ))}
//             </div>
//           </Fragment>)
//       });

//     case 9:
//       return qa.answers.map((ans, i) => {
//         const ansObj = JSON.parse(ans.answer);
//         return (
//           <Fragment key={i}>
//             <div style={{ display: 'flex', marginBottom: '30px', gap: '3em' }}>
//               <p style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}><b>{ansObj.variation} :</b></p>
//               {ansObj.files.map((img, i) => (
//                 <div key={i} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
//                   <LazyImage name={img} style={{ width: '10vw' }} />
//                 </div>
//               ))}
//             </div>
//           </Fragment>)
//       });

//     case 8: // Multiselect Picture Choice
//       if (qa.id === 23) {
//         const ansObj = JSON.parse(qa.answers[0].answer);
//         return (
//           <>
//             {ansObj.option.map((opt, i) => <p key={i}>{opt}</p>)}
//             {ansObj.desc && <p><b>Description: </b>{ansObj.desc}</p>}
//           </>
//         )
//       } else {
//         return qa.answers.map((ans, i) => <p key={i}>{ans.answer}</p>)
//       }

//     case 10: // Single Choice predefinded
//       if (qa.question.id === 24) {
//         const ansObj = JSON.parse(qa.answers[0].answer);
//         return (
//           <>
//             {/* {ansObj.option.map((opt, i) => <p key={i}>{opt}</p>)} */}
//             {ansObj.option && <p><b>Investment: </b>{ansObj.option}</p>}
//             {ansObj.amount && <p><b>Amount: </b>&nbsp;€{ansObj.amount} Cost per tons (in Euros)</p>}
//           </>
//         )
//       } else {
//         return qa.answers.map((ans, i) => <p key={i}>{ans.answer}</p>)
//       }

//     case 11: // Multiple Choice (Checkbox) predefined
//     case 15: // Confirm Checkbox
//     case 12: // Nested questions
//     case 2: // Date
//     default:
//       return qa.answers.map((ans, i) => <p key={i}>{ans.answer}</p>)
//   }
// }
// old function for getting answers --end----


function GetNewAnswer({ ans }) {
  //console.log("QA: ", ans);
  // ans.answers.map((ans) => {
  //   console.log("JSONP", JSON.parse(ans.answer));
    
  // });
  // cat.questions.map((que) => {
    switch (ans.question_type_id) {
      case 1: // TextBox
      // console.log(qa.answers);
        return ans.answers.map((ans, i) => <p key={i}>{ans.answer}</p>);
      case 3: //Select Dropdown predefined
      case 4: // Select Dropdown dynamic
        return ans.answers.map((ans, i) => <p key={i}>{ans.answer}</p>);
      case 5: //Multiselect Dropdown predefined
      case 6: // Multiselect dropdown dynamic
        return ans.answers.map((ans, i) => <p key={i}>{ans.answer}</p>);
      case 14: //Select (projectName) with TextBox
        return ans.answers.map((ans, i) => {
          //console.log("Proj", ans);
          const ansObj = JSON.parse(ans.answer);
          return (
            <Fragment key={i}>
              <p>{ansObj.option}</p>
              <p>{ansObj.projectName}</p>
            </Fragment>)
        });
        case 7: // Picture Choice predefined
          return ans.answers.map((ans, i) => {
            const ansObj = JSON.parse(ans.answer);
            return (
              <Fragment key={i}>
                <img src={`/images/${ansObj.brand}`} alt={ansObj.brand} />
                {ansObj.desc && <p>{ansObj.desc}</p>}
              </Fragment>)
          });
    
        case 13: // Add Multiple section Image Upload
          return ans.answers.map((ans, i) => {
            const ansObj = JSON.parse(ans.answer);
            return (
              <Fragment key={i}>
                {ansObj.desc && <p><b>{ansObj.desc}</b></p>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3em' }}>
                  {ansObj.files.map((img) => (
                    <LazyImage name={img} style={{ width: '10vw' }} />
                  ))}
                </div>
              </Fragment>)
          });
    
        case 9:
          return ans.answers.map((ans, i) => {
            const ansObj = JSON.parse(ans.answer);
            return (
              <Fragment key={i}>
                <div style={{ display: 'flex', marginBottom: '30px', gap: '3em' }}>
                  <p style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}><b>{ansObj.variation} :</b></p>
                  {ansObj.files.map((img, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      <LazyImage name={img} style={{ width: '10vw' }} />
                    </div>
                  ))}
                </div>
              </Fragment>)
          });
    
        case 8: // Multiselect Picture Choice
          if (ans.id === 23) {
            const ansObj = JSON.parse(ans.answers[0].answer);
            return (
              <>
                {ansObj.option.map((opt, i) => <p key={i}>{opt}</p>)}
                {ansObj.desc && <p><b>Description: </b>{ansObj.desc}</p>}
              </>
            )
          } else {
            return ans.answers.map((ans, i) => <p key={i}>{ans.answer}</p>)
          }
    
        case 10: // Single Choice predefinded
          if (ans.id === 24) {
            //console.log("yes", JSON.parse(ans.answers[0].answer));
            const ansObj = JSON.parse(ans.answers[0].answer);
            //console.log("AnsObj", ansObj);
            return (
              <>
                {/* {ansObj.option.map((opt, i) => <p key={i}>{opt}</p>)} */}
                {ansObj.option && <p><b>Investment: </b>{ansObj.option}</p>}
                {ansObj.amount && <p><b>Amount: </b>&nbsp;€{ansObj.amount} Cost per tons (in Euros)</p>}
              </>
            )
          } else {
            return ans.answers.map((ans, i) => <p key={i}>{ans.answer}</p>)
          }
    
        case 11: // Multiple Choice (Checkbox) predefined
        case 15: // Confirm Checkbox
        case 12: // Nested questions
        case 2: // Date
        default:
          return ans.answers.map((ans, i) =><p key={i}>{ans.answer}</p> );
      }
 
  }

  