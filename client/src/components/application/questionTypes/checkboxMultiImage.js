import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function CheckBoxImage({ question, index, value = [], onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);

  function handleInputChange(option) {
    setInput(prevInput => {
      const copyOld = [...prevInput];
      const index = prevInput.indexOf(option);
      index === -1 ? copyOld.push(option) : copyOld.splice(index, 1);
      return copyOld
    });
  }

  useEffect(() => {
    handleAnswerChange(question.id, defferInput);
  }, [handleAnswerChange, question.id, defferInput]);

  return (
    <div className="questionContainer">
      <h2 className="question">{question.question}</h2>
      <FormGroup onChange={handleInputChange}>
        {question.question_opt.map((opt) => (
          <FormControlLabel key={opt} control={<div><Checkbox checked={Boolean(input.find(x => x === opt))} /></div>} label={opt} name={opt} />
        ))}
      </FormGroup>
      {/* <div className="optionContainer">
        {question.question_opt.map((opt) => (
          <div className="imageBoxContainer" onClick={() => handleInputChange(opt)}>
            <Checkbox checked={Boolean(input.find(x => x === opt))} />
            <p>{opt}</p>
          </div>
        ))}
      </div> */}
      <div className='navBtnCont'>
        <div className="prevBtn" tabIndex={-1} onClick={() => handleNextPrevNav(index, 'prev')}><ArrowLeftRoundIcon /></div>
        <div className="nextBtn" tabIndex={-1} onClick={() => handleNextPrevNav(index, 'next')}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}

// function getSVG(option) {
//   switch (option) {
//     case "Pre-wash":
//     case "During wash":
//     case "After wash\n(wet)":
//     case "After wash\n(dry)"
//   }
// }