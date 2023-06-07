import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function CheckBoxConfirm({ question, nav, index, value = [], onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);
  
  function handleInputChange(e) {
    const option = e.target.name;
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

  function BasicExample(nav) {
    const element = document.getElementById(nav);
    console.log('new nav', nav);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  return (
    <div className="questionContainer">
      <h2 className="question">{question.question}</h2>
      <FormGroup onChange={handleInputChange}>
        {question.question_opt.map((opt) => (
          <FormControlLabel key={opt} control={<Checkbox checked={Boolean(input.find(x => x === opt))} />} label={opt} name={opt} />
        ))}
      </FormGroup>
      <div className='navBtnCont'>
          <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
          <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}