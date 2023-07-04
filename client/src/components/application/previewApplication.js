import { Button, Dialog } from "@mui/material";
import { Fragment } from "react";
import { LazyImage } from "../../assets/image/lazyImage";
import ArrowLeftRoundIcon from "../../assets/icons/arrowLeftRoundIcon";

export default function PreviewApp({ open, handleClose, handleDraft, handleSubmit, answers, catWiseQues, uploadedImageName, uploadedImageData }) {
  // console.log({ catWiseQues });
  // console.log({ answers });
  // console.log("IMAGE_DATA: ", uploadedImageData);

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <div className="appFormContainer">
        <div className="sidebar viewSidebar">
          <div className="sidebarTopArea">
            <div className="btnBack" onClick={handleClose}><ArrowLeftRoundIcon /></div>
            <p>Preview Application</p>
          </div>
          <div className="sidebarMidArea">{answers?.[1]?.projectName ?? "N/A"}</div>
          <div className="btnSidebarBottom">
            <Button variant="outlined" onClick={handleDraft}>Save as Draft</Button>
            <Button variant="outlined" onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
        <div className="QAWrapper">
          <div className="previewQA">
            {catWiseQues.map((cat) => <NewQuesAns key={cat.category_id} category={cat} answers={answers} uploadedImageName={uploadedImageName} uploadedImageData={uploadedImageData} />)}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

function NewQuesAns({ category, answers, uploadedImageName, uploadedImageData }) {
  // console.log(category);
  return (
    <div className='QAContainer'>
      <div className='rectangle'>
        <h3 className='categoryTxt'>{category.category_id}. {category.category_name}</h3>
      </div>
      {category.questions.map((que, queIndex) => {
        if (que.question_type_id === 12) {
          return (
            <Fragment key={que.id}>
              <h4 style={{ color: '#03297D' }}>{`${que.CatWiseQueIndex} ${que.question}`}</h4>
              <div className='answerContainer'>
                <div className="nestedContainer">
                  {que.id === 7 ? (
                    que.nestedQue.map((nestQue, nestIndex) => {
                      const inputAns = answers[nestQue.id];
                      console.log(nestQue);
                      return (
                        <div key={nestIndex} className="nested-answer">
                          <p className="nested">{nestQue.question}</p>
                          {inputAns ? inputAns.map((ans, ansIndex) => <p key={ansIndex}>{ans}</p>) : <p>N/A</p>}
                        </div>
                      );
                    })
                  ) : (
                    que.nestedQue.map((nestQue, nestIndex) => {
                      const inputAns = answers[nestQue.id];
                      const prevQue = category.questions[queIndex - 1].nestedQue.map((nestQue) => answers[nestQue.id]);
                      return (
                        <div key={nestIndex} className="nested-answer">
                          <p className="nested">{nestQue.question}</p>
                          {inputAns ? inputAns.map((ans, ansIndex) => <p key={ansIndex}>{prevQue[nestIndex][ansIndex]} {ans}</p>) : <p>N/A</p>}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </Fragment>
          )
        } else {
          return (answers[que.id] &&
            <Fragment key={que.id}>
              <h4 style={{ color: '#03297D' }}>{`${que.CatWiseQueIndex} ${que.question}`}</h4>
              <div className='answerContainer'>
                <GetAnswer question={que} answers={answers} uploadedImageName={uploadedImageName[que.id]} uploadedImageData={uploadedImageData} />
              </div>
            </Fragment>
          )
        }
      })}
    </div>
  )
}

function GetAnswer({ question, answers, uploadedImageName, uploadedImageData }) {
  // console.log(question);
  // console.log(answers[question.id]);
  // console.log("TYPE_ID: ", question.question_type_id);
  // debugger;
  switch (question.question_type_id) {
    case 1: // TextBox
      return <p>{answers[question.id] ?? "N/A"}</p>;
    case 3: //Select Dropdown predefined
    case 4: // Select Dropdown dynamic
      return <p>{answers[question.id] ?? "N/A"}</p>;
    // return null;
    case 5: //Multiselect Dropdown predefined
    case 6: // Multiselect dropdown dynamic
      return answers[question.id]?.map((ans, i) => <p key={i}>{ans}</p>);
    case 14: //Select (projectName) with TextBox
      return (
        <>
          <p>{answers[question.id].option}</p>
          <p>{answers[question.id].projectName}</p>
        </>
      )
    case 7: // Picture Choice predefined
      return (
        <>
          <img src={`/images/${answers[question.id].brand}`} alt={answers[question.id].brand} />
          {answers[question.id].desc && <p>{answers[question.id].desc}</p>}
        </>
      )

    case 13: // Add Multiple section Image Upload
      // console.log("IMAGE_UPLOAD:", answers[question.id]);
      // console.log("UPLOADED_FILES_NAME: ", uploadedImageName);
      // console.log("UPLOADED_FILES: ", uploadedImageData);
      return (
        <>
          {answers[question.id].desc && <p><b>{answers[question.id].desc}</b></p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3em' }}>

            {answers[question.id].files.map((img) => <LazyImage key={img} name={img} style={{ width: '10vw' }} />)}

            {uploadedImageName?.map(imgName => {
              const file = uploadedImageData.find(file => file.name === imgName);
              return <img key={imgName} src={/jpeg|png|jpg/.test(file.type) ? URL.createObjectURL(file) : '/image/icon/file_pdf.png'} style={{ width: '100px' }} alt="PDF Icon" />
            })}

          </div>
        </>
      )

    case 9: // Multi Variation Image Upload
      // console.log("IMAGE_UPLOAD:", answers[question.id]);
      // console.log("UPLOADED_FILES_NAME: ", uploadedImageName);
      // console.log("UPLOADED_FILES: ", uploadedImageData);
      return (
        answers[question.id]?.map((obj, index) => {
          return (
            <Fragment key={index}>
              <p>{obj.variation}</p>
              {obj.files.map((img) => <LazyImage key={img} name={img} style={{ width: '10vw' }} />)}
              {uploadedImageName[index]?.files.map((imgName) => {
                const file = uploadedImageData.find(file => file.name === imgName);
                return <img key={imgName} src={/jpeg|png|jpg/.test(file.type) ? URL.createObjectURL(file) : '/image/icon/file_pdf.png'} style={{ width: '100px' }} alt="PDF Icon" />
              })}
            </Fragment>
          )
        })
      )

    case 8: // Multiselect Picture Choice
      if (question.id === 23) {
        const ansObj = answers[question.id];
        return (
          <>
            {ansObj?.option.map((opt, i) => <p key={i}>{opt}</p>)}
            {ansObj?.desc && <p><b>Description: </b>{ansObj.desc}</p>}
          </>
        )
      } else {
        return answers[question.id]?.map((ans, i) => <p key={i}>{ans}</p>)
      }

    case 10: // Single Choice predefinded
      if (question.id === 24) {
        const ansObj = answers[question.id];
        //console.log("AnsObj", ansObj);
        return (
          <>
            {ansObj.option && <p><b>Investment: </b>{ansObj.option}</p>}
            {ansObj.amount && <p><b>Amount: </b>&nbsp;€{ansObj.amount} Cost per tons (in Euros)</p>}
          </>
        )
      } else {
        return <p>{answers[question.id] ?? "N/A"}</p>
      }
    case 12: // Nested questions
      console.log("Q_TYPE_12:", answers[question.id]);
      console.log("Q_ID: ", question);
      return null;

    case 11: // Multiple Choice (Checkbox) predefined
    case 15: // Confirm Checkbox
    case 2: // Date
    default:
      return answers[question.id]?.map((ans, i) => <p key={i}>{ans}</p>);
  }
}