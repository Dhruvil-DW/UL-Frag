import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { FormControlLabel, Radio, RadioGroup, TextField, Tooltip } from "@mui/material";
import TooltipIcon from "../../../assets/icons/tooltipIcon";

export default function RadioText({ question, nav, index, value = "", onKeyUp }) {
  const { handleAnswerChange } = useContext(ApplicationContext);
  // const [input, setInput] = useState(question.question_opt.includes(value) ? value : "Any other");
  // const [textInput, setTextInput] = useState((value && !(question.question_opt.includes(value))) ? value : "");
  const [input, setInput] = useState(value ? (question.question_opt.includes(value) ? value : "Any other") : "");
  const [textInput, setTextInput] = useState(value && !(question.question_opt.includes(value)) ? value : "");
  const defferInput = useDeferredValue(input);
  const defferTextInput = useDeferredValue(textInput);
  function handleInputChange(__event, value) {
    setInput(value);
  }
  function handleTextChange(e) {
    setTextInput(e.target.value);
  }
  useEffect(() => {
    if(defferInput === 'Any other'){
      handleAnswerChange(question.id, defferTextInput)
    } else {
      handleAnswerChange(question.id, defferInput); 
    }
  }, [handleAnswerChange, question.id, defferInput, defferTextInput])

  function BasicExample(nav) {
    const element = document.getElementById(nav);
    console.log('new nav', nav);
    console.log('element', element)
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
}

  return (
    <div className="questionContainer fixWidth">
      {/* <h2 className="question">{`${question.CatWiseQueIndex} ${question.question}`}
      {question.id === 24 && 
      <Tooltip className="tooltip" title={question.description} placement="bottom-start" arrow>
            <span style={{ marginLeft: 7, verticalAlign: "middle", display: "inline-flex"}}>
              <TooltipIcon />
            </span>
          </Tooltip>
      
      }
      </h2> */}
      <h2 className="question">
        <span style={{marginRight: 7 }}>{`${question.CatWiseQueIndex}`}</span>
        <span style={{verticalAlign: "middle" }}>
        {question.question}
        {question.id === 24 && 
          <Tooltip className="tooltip" title={question.description} placement="bottom-start" arrow>
            <span style={{ marginLeft: 7, verticalAlign: "middle", display: "inline-flex"}}>
              <TooltipIcon />
            </span>
          </Tooltip>
        }
        </span>
        </h2>
      <RadioGroup value={input} onChange={handleInputChange} name={question.id.toString()}>
        {question.question_opt?.map((opt) => (
          <div key={opt}>
            <FormControlLabel key={opt} label={opt} value={opt} control={<Radio />} />
            {opt === 'Any other' && input === 'Any other' && (
              <TextField
              fullWidth
              id="OtherInvestmentField"
              variant="outlined"
              color="secondary"
              name="OtherInvestment"
              placeholder="Enter other launch phase"
              value={textInput}
              onKeyUp={onKeyUp}
              onChange={handleTextChange}
            />
            )}
          </div>
            ))}
        {/* {input.investment === "Any other" && (
          <TextField variant="outlined" 
          color="secondary" 
          placeholder="Enter Category Name" 
          name="Other Category" 
          value={textInput} 
          onKeyUp={onKeyUp} 
          onChange={handleTextChange} />
        )} */}
      </RadioGroup>
      <div className='navBtnCont'>
          <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
          <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}