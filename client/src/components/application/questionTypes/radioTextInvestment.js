import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { FormControlLabel, InputAdornment, Radio, RadioGroup, TextField } from "@mui/material";

export default function RadioTextInvestment({ question, nav, index, value = "", onKeyUp }) {
  const { handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(question.question_opt.includes(value) ? value : "Incremental");
  const [textInput, setTextInput] = useState(question.question_opt.includes(value) ? "" : value);
  const defferInput = useDeferredValue(input);
  const defferTextInput = useDeferredValue(textInput);

  function handleInputChange(__event, value) {
    console.log(value);
    setInput(value);
  }

  function handleTextChange(e) {
    setTextInput(e.target.value);
  }

  useEffect(() => {
    if (defferInput === "Incremental") {
      handleAnswerChange(question.id, defferTextInput);
    } else {
      handleAnswerChange(question.id, defferInput);
    }
  }, [handleAnswerChange, question.id, defferInput, defferTextInput]);

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

      <RadioGroup value={input} onChange={handleInputChange} name={question.id.toString()}>
        {question.question_opt?.map((opt) => (
          <div key={opt}>
            <FormControlLabel label={opt} value={opt} control={<Radio />} />
            {opt === "Incremental" && input === "Incremental" && (
              <TextField
                id="investmentField"
                variant="outlined"
                color="secondary"
                name="Investment"
                placeholder="0.00"
                value={textInput}
                onKeyUp={onKeyUp}
                onChange={handleTextChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  endAdornment: <InputAdornment position="start"><p style={{ fontSize: 14 }}>| Cost per tons (in Euros)</p></InputAdornment>
                }}
              />)}
          </div>
        ))}
      </RadioGroup>

      <div className='navBtnCont'>
        <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
        <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}