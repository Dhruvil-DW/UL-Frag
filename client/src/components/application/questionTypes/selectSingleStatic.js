import { Autocomplete, TextField } from "@mui/material";
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function SelectSingleStatic({ question, index, value = null, onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);

  function handleInputChange(__event, value, __reason) {
    setInput(value);
  }

  useEffect(() => {
    handleAnswerChange(question.id, defferInput);
  }, [handleAnswerChange, question.id, defferInput]);

  return (
    <div className="questionContainer">
      <h2 className="question">{question.question}</h2>
      <Autocomplete
        disablePortal
        options={question.question_opt ?? []}
        value={input}
        onChange={handleInputChange}
        popupIcon={<ArrowDownIcon />}
        renderInput={(params) => <TextField {...params} variant="outlined" color="secondary" placeholder="Select Option" />}
        onKeyUp={onKeyUp}
      />
      <div className='navBtnCont'>
        <div className="prevBtn" tabIndex={-1} onClick={() => handleNextPrevNav(index, 'prev')}><ArrowLeftRoundIcon /></div>
        <div className="nextBtn" tabIndex={-1} onClick={() => handleNextPrevNav(index, 'next')}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}