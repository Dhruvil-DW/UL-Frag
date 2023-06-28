import { InputAdornment, TextField } from "@mui/material";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";
import TooltipIcon from "../../../assets/icons/tooltipIcon";
import Tooltip from "@mui/material/Tooltip";

export default function TextBox({ question, nav, index, value = "", onKeyUp }) {
  const { handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  //console.log("INPutLen", input.length);
  const defferInput = useDeferredValue(input);

  useEffect(() => {
    handleAnswerChange(question.id, defferInput);
  }, [handleAnswerChange, question.id, defferInput]);

  function BasicExample(nav) {
    const element = document.getElementById(nav);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  const isInputValid = input.length < 1000;
  return (
    <>
      <div className="questionContainer fixWidth" style={{ flexGrow: 0 }}>
      {question.id === 21 &&
        <p className="addText">Liking input</p>
      }
      {question.id === 22 &&
        <p className="addText">Character input</p>
      }
        <h2 className="question">
        <span style={{marginRight: 7 }}>{`${question.CatWiseQueIndex}`}</span>
        <span style={{verticalAlign: "middle" }}>
        {question.question}
          <Tooltip className="tooltip" title={question.description} placement="bottom-start" arrow>
            <span style={{ marginLeft: 7, verticalAlign: "middle", display: "inline-flex"}}>
              <TooltipIcon />
            </span>
          </Tooltip>
        </span>
        </h2>
        <TextField multiline rows={8} sx={{marginLeft: '31px'}} inputProps={{ maxLength: 1000 }} InputProps={{ endAdornment: <InputAdornment sx={{ position: "absolute", right: 16, bottom: 16, color: "hsl(0, 0%, 90%)" }} position="end">{`${input?.length ?? 0} / 1000`}</InputAdornment> }}  variant="outlined" color="secondary" placeholder="Enter your answer here" value={input} onChange={(e) => setInput(e.target.value)} />
        {/* <div style={{ position: "absolute", bottom: 8, right: 24, color: "hsl(0, 0%, 60%)" }}>{`${input.length ?? 0} / 1000`}</div> */}
        {/* {input.length > 1000 && 
        promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: "Max word limit is 1000" } })
        } */}
        {!isInputValid && (
        <p style={{ fontSize: 12, color: 'red', marginLeft: '31px' }}>
          Input length should not exceed 1000 characters.
        </p>
      )}
        <div className='navBtnCont'>
          <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
          <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
        </div>
      </div>
    </>
  )
}