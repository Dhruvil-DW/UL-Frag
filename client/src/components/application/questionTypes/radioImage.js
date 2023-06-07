import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";

export default function RadioImage({ question, nav, index, value = {}, onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferedInput = useDeferredValue(input);
  // console.log(question);

  useEffect(() => {
    if (defferedInput.brand || defferedInput.desc) {
      handleAnswerChange(question.id, defferedInput);
    } else if (!defferedInput.brand && !defferedInput.desc) {
      handleAnswerChange(question.id, null);
    }
  }, [defferedInput, handleAnswerChange, question.id])

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

      <div style={{ display: "flex", gap: "1rem" }}>

        <RadioGroup value={input.brand ?? ""} onChange={(e, value) => setInput((prevInput) => ({ ...prevInput, brand: value }))} style={{ flexGrow: 1 }}>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {question.question_opt?.map((path) => (
              <FormControlLabel key={path} label={<BrandImage path={path} />} value={path} control={<Radio style={{ alignSelf: "flex-start" }} />} />
            ))}
          </div>
        </RadioGroup>

        <div style={{ height: 300, minWidth: 230, backgroundColor: "hsl(168, 100%, 35%)", padding: 16 }}>
          <h3 style={{ color: "white", fontSize: 18 }}>Global Brand Position</h3>
          <TextField multiline rows={8} placeholder="Enter your description here" sx={{ '& .MuiInputBase-multiline': { borderRadius: 0, padding: 0 } }} value={input.desc} onChange={(e) => setInput((prevInput) => ({ ...prevInput, desc: e.target.value }))} />
        </div>
      </div>

      <div className='navBtnCont'>
          <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
          <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}

function BrandImage({ path }) {
  return (
    <div style={{ height: 80, display: "flex", alignItems: "flex-end" }}>
      <img src={`/images/${path}`} alt="BrandImage" />
    </div>
  )
}