import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { FormControlLabel, InputAdornment, Radio, RadioGroup, TextField, Tooltip } from "@mui/material";
import TooltipIcon from "../../../assets/icons/tooltipIcon";

export default function RadioTextInvestment({ question, nav, index, value = { option: "", amount: "" }, onKeyUp }) {
  const { handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);

  function handleInputChange(__event, value) {
    setInput((prevInput) => ({ ...prevInput, option: value }));
  }

  useEffect(() => {
    if (defferInput.option || defferInput.amount) {
      handleAnswerChange(question.id, defferInput);
    } else {
      handleAnswerChange(question.id, null);
    }
  }, [handleAnswerChange, question.id, defferInput]);

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
      {/* <h2 className="question">{`${question.CatWiseQueIndex} ${question.question}`}
      
      <Tooltip className="tooltip" title={question.description} placement="bottom-end" arrow>
            <span style={{ marginLeft: 7, verticalAlign: "middle", display: "inline-flex"}}>
              <TooltipIcon />
            </span>
          </Tooltip>
      </h2> */}
      <h2 className="question">
        <span style={{marginRight: 7 }}>{`${question.CatWiseQueIndex}`}</span>
        <span style={{verticalAlign: "middle" }}>
        {question.question}
          <Tooltip className="tooltip" title={question.description} placement="bottom-end" arrow>
            <span style={{ marginLeft: 7, verticalAlign: "middle", display: "inline-flex"}}>
              <TooltipIcon />
            </span>
          </Tooltip>
        </span>
        </h2>
      <RadioGroup value={input.option} onChange={handleInputChange} name={question.id.toString()}>
        {question.question_opt?.map((opt) => (
          <div key={opt}>
            <FormControlLabel label={opt} value={opt} control={<Radio />} />
            {opt === input.option && (
              <TextField
                id="investmentField"
                variant="outlined"
                color="secondary"
                name="Investment"
                placeholder="0.00"
                value={input.amount}
                onKeyUp={onKeyUp}
                onChange={(e) => setInput((prevInput) => ({ ...prevInput, amount: e.target.value }))}
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