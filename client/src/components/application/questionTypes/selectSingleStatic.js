import { Autocomplete, TextField } from "@mui/material";
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function SelectSingleStatic({ question, nav, index, value = null, onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);

  function handleInputChange(__event, value, __reason) {
    setInput(value);
  }

  useEffect(() => {
    handleAnswerChange(question.id, defferInput);
  }, [handleAnswerChange, question.id, defferInput]);
 console.log('singleMulti',nav);

 function BasicExample(nav) {
  const element = document.getElementById(nav);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

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
        {/* <a href={`#${(nav) - 1}`} className="navlink"> */}
          <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
        {/* </a> */}
        {/* <a href={`#${(nav) + 1}`} className="navlink"> */}
          <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
        {/* </a> */}
      </div>
    </div>
  )
}