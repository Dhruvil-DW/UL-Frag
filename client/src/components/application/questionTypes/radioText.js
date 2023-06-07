import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

export default function RadioText({ question, nav, index, value = "", onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);

  function handleInputChange(__event, value) {
    setInput(value);
  }

  useEffect(() => {
    handleAnswerChange(question.id, defferInput);
  }, [handleAnswerChange, question.id, defferInput])

  return (
    <div className="questionContainer">
      <h2 className="question">{question.question}</h2>

      <RadioGroup value={value} onChange={handleInputChange} name={question.id.toString()}>
        {question.question_opt?.map((opt) => (
          <FormControlLabel key={opt} label={opt} value={opt} control={<Radio />} />
        ))}
      </RadioGroup>

      <div className='navBtnCont'>
        <a href={`#${(nav) - 1}`} className="navlink">
          <div className="prevBtn" tabIndex={-1} onClick={() => handleNextPrevNav(index, 'prev')}><ArrowLeftRoundIcon /></div>
        </a>
        <a href={`#${(nav) + 1}`} className="navlink">
          <div className="nextBtn" tabIndex={-1} onClick={() => handleNextPrevNav(index, 'next')}><ArrowLeftRoundIcon /></div>
        </a>
      </div>
    </div>
  )
}