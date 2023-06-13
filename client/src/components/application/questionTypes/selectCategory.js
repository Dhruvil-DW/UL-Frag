import { Autocomplete, TextField } from "@mui/material";
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function SelectCategory({ question, nav, index, value = null, onKeyUp }) {
  const { handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(question.question_opt.includes(value) ? value : "Other");
  const [textInput, setTextInput] = useState(question.question_opt.includes(value) ? "" : value);
  const defferInput = useDeferredValue(input);
  const defferTextInput = useDeferredValue(textInput);

  function handleInputChange(__event, value, __reason) {
    setInput(value);
  }

  function handleTextChange(e) {
    setTextInput(e.target.value);
  }

  useEffect(() => {
    if (defferInput === "Other") {
      handleAnswerChange(question.id, defferTextInput);
    } else {
      handleAnswerChange(question.id, defferInput);
    }
  }, [handleAnswerChange, question.id, defferInput, defferTextInput]);
  //  console.log('singleMulti',nav);

  function BasicExample(nav) {
    const element = document.getElementById(nav);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="questionContainer fixWidth">
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
      {input === "Other" && <TextField variant="outlined" color="secondary" placeholder="Enter Category Name" name="Other Category" value={textInput} onKeyUp={onKeyUp} onChange={handleTextChange} />}

      <div className='navBtnCont'>
        <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
        <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}