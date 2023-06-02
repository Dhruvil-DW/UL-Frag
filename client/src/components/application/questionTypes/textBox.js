import { Autocomplete, TextField } from "@mui/material";
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function TextBox({ question, index, value = "", onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);

  useEffect(() => {
    handleAnswerChange(question.id, defferInput);
  }, [handleAnswerChange, question.id, defferInput]);

  return (
    <div className="questionContainer">
      <h2 className="question">{question.question}</h2>
      <TextField multiline rows={8} variant="outlined" color="secondary" placeholder="Enter your description here" value={input} onChange={(e) => setInput(e.target.value)} />
      <div className='navBtnCont'>
        <div className="prevBtn" tabIndex={-1} onClick={() => handleNextPrevNav(index, 'prev')}><ArrowLeftRoundIcon /></div>
        <div className="nextBtn" tabIndex={-1} onClick={() => handleNextPrevNav(index, 'next')}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}