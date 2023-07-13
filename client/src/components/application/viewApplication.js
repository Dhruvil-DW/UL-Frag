import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CategoryIcon from '../../assets/icons/categoryIcon';
import UserIcon from '../../assets/icons/userIcon';
import CalenderIcon from '../../assets/icons/calenderIcon';
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
import download from 'downloadjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ViewApplication() {
  const { appId } = useParams();
  const viewRef = useRef(null);
  // const [exportData, setExportData] = useState([]);
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
  console.log(questions.data);

  useEffect(() => {
    if (questions.data && queAns.length) {
      const finalResult = [];
      questions.data.forEach((cat) => {
        const questionWithAns = [];
        cat.questions.forEach((que) => {
          if (que.question_type_id === 12) {
            // debugger;
            const answer = queAns.filter((qa) => [que.id + 1, que.id + 2, que.id + 3].includes(qa.question_id))
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

  function getExport() {
    getData(`user/get/export/${appId}`, { responseType: "blob" }, (data) => download(data))
  }


  // async function createPDF() {
  //   const content = viewRef.current.children;
  //   const QAContainer = content[1].getElementsByClassName("QAContainer");
  //   // QA.style.overflowY = 'visible';
  //   // console.log(QA.clientWidth);
  //   const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: [297, 210] });
  //   console.log({ QAContainer });
  //   let pageY = 20;
  //   for (const QA_Cont of QAContainer) {
  //     // Add Title of Section
  //     const title = QA_Cont.getElementsByTagName("h3")[0].innerHTML;
  //     doc.setTextColor(3, 41, 125).text(title, 10, pageY).setTextColor(0, 0, 0);
  //     pageY += 10;
  //     if (pageY > 287) {
  //       doc.addPage();
  //       pageY = 20;
  //     }
  //     // console.log(doc.getFontList());
  //     // Add Questions
  //     const questions = [...QA_Cont.getElementsByTagName("h4")];
  //     const answerContainer = QA_Cont.getElementsByClassName("answerContainer");
  //     console.log(questions);

  //     for (const QueIndex in questions) {
  //       if (QueIndex === "length") break;
  //       const question = questions[QueIndex].innerHTML;
  //       const answers = answerContainer[QueIndex].getElementsByTagName("p");
  //       doc.text(question, 10, pageY);
  //       pageY += 10;
  //       if (pageY > 287) {
  //         doc.addPage();
  //         pageY = 20;
  //       }
  //       for await (const ans of answers) {
  //         console.log(ans);
  //         const answer = ans.innerHTML;
  //         // doc.text(answer, 10, pageY);
  //         doc.html(ans, { html2canvas: { height: ans.clientHeight, width: ans.clientWidth, x: 10, y: pageY }, width: ans.clientHeight });
  //         pageY += 10;
  //         if (pageY > 287) {
  //           doc.addPage();
  //           pageY = 20;
  //         }
  //       }
  //     }
  //   }
const customData = {
  project_name: appData.project_name,
  application_status: appData.application_status?.status ?? "N/A",
  category: queAns.find((item) => item.question_id === 3)?.answers[0]?.answer ?? "N/A",
  user_name: `${appData.User?.first_name ?? "N/A"} ${appData.User?.last_name ?? ""}`,
  updated_at: formatDate(appData.updated_at) ?? "N/A"
};
// console.log(customData.project_name);
const handleDownload = () => {
    // const content = viewRef.current.children;
  // console.log(viewRef.current.children);
    const qa = viewRef.current.children[1];
    qa.style.overflowY = 'visible';
    
    html2canvas(qa,{
      width: qa.clientWidth,
      height: qa.scrollHeight,
      autoPaging:true
        // width: 2480,
        // height: 3508
      }).then((canvas) => {
        let imgWidth = 700;
        let pageHeight = 780;
        let imgHeight =
        ((canvas.height * imgWidth) / 2454)*1.34;
        //console.log("Canvas", imgHeight);
        let heightLeft = imgHeight;
        const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF("landscape", "pt", [700, 780]);
      doc.setFontSize(10).setTextColor(3, 41, 125).setFont('Poppins').text("Project Name:" + customData.project_name, 70,10, {align:'left'});
      doc.setFontSize(10).text("Status:" + customData.application_status, 70,20, {align:'left'});
      doc.setFontSize(10).text("Category:" + customData.category, 70,30, {align:'left'});
      doc.setFontSize(10).text("User Name:" + customData.user_name, 70,40, {align:'left'});
      // doc.setFontSize(11).setTextColor(3, 41, 125).setFont('Poppins').text("Project Name:" + customData.project_name, 70,20, {align:'left'});
      // doc.setFontSize(11).text("Status:" + customData.application_status, 200,20, {align:'left'});
      // doc.setFontSize(11).text("Category:" + customData.category, 300,20, {align:'left'});
      // doc.setFontSize(11).text("User Name:" + customData.user_name, 500,20, {align:'left'});
      // doc.setFontSize(10).text("Last Edited:"+ customData.updated_at, 50,50, {align:'left'});
      let position = 50;
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, null, 'NONE');
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 120;

        doc.addPage();
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      doc.save(`${appData.project_name}.pdf`);
    });
    qa.style.overflowY = 'auto';
};
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
    <div className='appFormContainer' id="appForm" ref={viewRef}>
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
            <h2 style={{ marginLeft: "1rem", maxWidth: 250, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", fontWeight: 400 }}>{appData.project_name ?? "N/A"}</h2>
            {/* <p className='viewSidebarIconText'><PageIcon />{appData.application_status?.status ?? "N/A"}</p> */}
            <Button variant='outlined' sx={{ marginLeft: '1rem' }}>{appData.application_status?.status ?? "N/A"}</Button>
            <p style={{ marginLeft: '1rem' }}>{queAns.find((item) => item.question_id === 3)?.answers[0]?.answer ?? "N/A"}</p>
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
              {appData.application_status_id === 2 && 
              <>
                <Button variant="contained" onClick={handleDownload}>Export</Button>
              </>
                }
              <Button variant="outlined" startIcon={<LogoutArrowIcon />} onClick={() => navigate('/logout')}>Logout</Button>
            </div>
          </>
        )}
      </div>
      <div className='QAWrapper'>
        {/* {queAns.map((qa, index) => <QueAns key={qa.id} index={index + 1} qa={qa} />)} */}
        {result.map((cat) => <NewQuesAns key={cat.category_id} category={cat} />)}
      </div>
    </div>
  )
}


function NewQuesAns({ category }) {
  // console.log(category);
  return (
    <div className='QAContainer'>
      <div className='rectangle'>
        <h3 className='categoryTxt'>{category.category_id}. {category.category_name}</h3>
      </div>
      {category.questions.map((que, index) =>
        // console.log("answers", que.answers)
        <Fragment key={que.id}>
          <h4 style={{ color: '#03297D' }}>{`${que.CatWiseQueIndex} ${que.question}`}</h4>
          <div className='answerContainer'>

            <GetNewAnswer ans={que} index={index} category={category} />
          </div>
        </Fragment>
      )}
    </div>

  )
}


function GetNewAnswer({ ans, index, category }) {
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

    case 12: // Nested questions
      // console.log("ANS", ans);
      // console.log("Q_TYPE_12:", ans.answers);
      return (
        <div className="nestedContainer">
          {ans.id === 7 ? (
            ans.nestedQue.map((que, i) => {
              const answers = ans.answers?.find((ans) => ans.question_id === que.id)?.answers;
              return (
                <div key={i} className="nested-answer">
                  <p className="nested">
                    {que.question}
                  </p>
                  {answers ? answers.map(ans => <p>{ans.answer}</p>) : <p>N/A</p>}
                </div>
              );
            })

          ) : (
            ans.nestedQue.map((que, i) => {
              const prevAns = category.questions[index - 1].answers;
              const country = prevAns.find((prev) => prev.question_id === que.question_opt)?.answers;
              const answers = ans.answers?.find((ans) => ans.question_id === que.id)?.answers;
              // console.log({ country, answers });
              return (
                <div key={i}>
                  <p>
                    <b>{que.question}</b>
                  </p>
                  {answers ? (
                    answers?.map((ans, index) => <p key={index}><b>{country[index]?.answer}:</b> {ans.answer}</p>)
                  ) : (
                    country?.map((c, index) => <p key={index}><b>{c.answer}:</b> N/A</p>)
                  )}
                </div>
              );
            })
          )}
        </div>
      );

    case 11: // Multiple Choice (Checkbox) predefined
    case 15: // Confirm Checkbox
    case 2: // Date
    default:
      return ans.answers.map((ans, i) => <p key={i}>{ans.answer}</p>);
  }

}


