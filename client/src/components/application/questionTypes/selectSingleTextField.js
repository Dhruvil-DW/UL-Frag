import { Autocomplete, TextField } from "@mui/material";
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function SelectSingleWithTextStatic({ question, nav, index, value = {}, onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferedInput = useDeferredValue(input);

  function handleInputChange(__event, value, __reason) {
    setInput({ option: value });
  }

  useEffect(() => {
    if (defferedInput.option || defferedInput.projectName) {
      handleAnswerChange(question.id, defferedInput);
    } else if (!defferedInput.brand && !defferedInput.desc) {
      handleAnswerChange(question.id, null);
    }
  }, [handleAnswerChange, question.id, defferedInput]);

  function BasicExample(nav) {
    const element = document.getElementById(nav);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
}

  return (
    <div className="questionContainer">
      <h2 className="question">{question.question}</h2>
      <Autocomplete
        disablePortal
        options={question.question_opt}
        value={input.option ?? null}
        onChange={handleInputChange}
        popupIcon={<ArrowDownIcon />}
        renderInput={(params) => <TextField {...params} variant="outlined" color="secondary" placeholder="Select Option" />}
        onKeyUp={onKeyUp}
      />
      <TextField variant="outlined" color="secondary" placeholder="Enter Project Name" name="projectName" value={input.projectName ?? ""} onChange={(e) => setInput(prevInput => ({ ...prevInput, [e.target.name]: e.target.value }))} disabled={!Boolean(input.option)} onKeyUp={onKeyUp} />
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