import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { FormControlLabel, Radio, RadioGroup, Tooltip } from "@mui/material";
import TooltipIcon from "../../../assets/icons/tooltipIcon";

export default function RadioText({ question, nav, index, value = "", onKeyUp }) {
  const { handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);

  function handleInputChange(__event, value) {
    setInput(value);
  }

  useEffect(() => {
    handleAnswerChange(question.id, defferInput);
  }, [handleAnswerChange, question.id, defferInput])

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
      <RadioGroup value={value} onChange={handleInputChange} name={question.id.toString()} style={{marginLeft: '32px'}}>
        {question.question_opt?.map((opt) => (
          <FormControlLabel key={opt} label={opt} value={opt} control={<Radio />} />
        ))}
      </RadioGroup>

      <div className='navBtnCont'>
          <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
          <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}