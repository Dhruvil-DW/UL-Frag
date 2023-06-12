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
      <h2 className="question">{question.question}</h2>

      <RadioGroup value={value} onChange={handleInputChange} name={question.id.toString()}>
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