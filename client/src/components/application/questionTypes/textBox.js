import { TextField } from "@mui/material";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";
import TooltipIcon from "../../../assets/icons/tooltipIcon";
import Tooltip from "@mui/material/Tooltip";

export default function TextBox({ question, nav, index, value = "", onKeyUp }) {
  const { handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);

  useEffect(() => {
    handleAnswerChange(question.id, defferInput);
  }, [handleAnswerChange, question.id, defferInput]);

  function BasicExample(nav) {
    const element = document.getElementById(nav);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  return (
    <div className="questionContainer fixWidth" style={{ flexGrow: 0 }}>
      <h2 className="question">
        {question.question}
        <Tooltip className="tooltip" title={question.description} placement="bottom-end" arrow>
          <span style={{ marginLeft: 7, verticalAlign: "middle", display: "inline-flex" }}>
            <TooltipIcon />
          </span>
        </Tooltip>
      </h2>
      <TextField multiline rows={8} inputProps={{ maxLength: 100 }} variant="outlined" color="secondary" placeholder="Enter your description here" value={input} onChange={(e) => setInput(e.target.value)} />
      <div style={{ position: "absolute", bottom: 8, right: 24, color: "hsl(0, 0%, 60%)" }}>{`${input.length ?? 0} / 100`}</div>
      
      <div className='navBtnCont'>
        <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
        <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}