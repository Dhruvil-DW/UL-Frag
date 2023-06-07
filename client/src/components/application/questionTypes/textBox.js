import { Autocomplete, TextField } from "@mui/material";
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";
import TooltipIcon from "../../../assets/icons/tooltipIcon";
import Tooltip from "@mui/material/Tooltip";

export default function TextBox({ question, nav, index, value = "", onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange } = useContext(ApplicationContext);
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
    <div className="questionContainer">
      <h2 className="question">
        {question.question}
      <Tooltip className="tooltip" title={question.description} placement="bottom-end" arrow>
        <span style={{marginLeft:7}}>
        <TooltipIcon/>
        </span>
      </Tooltip>
      </h2>
      <TextField multiline rows={8} variant="outlined" color="secondary" placeholder="Enter your description here" value={input} onChange={(e) => setInput(e.target.value)} />
      <div className='navBtnCont'>

      {/* <a href={`#${(nav)-1}`} className="navlink"> */}
        <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
        {/* </a> */}
        {/* <a href={`#${(nav)+1}`} className="navlink"> */}
          <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
          {/* </a> */}
      </div>
    </div>
  )
}