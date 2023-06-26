import { Checkbox, Tooltip } from "@mui/material";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";
import TooltipIcon from "../../../assets/icons/tooltipIcon";

export default function CheckBoxImage({ question, nav, index, value = [], onKeyUp }) {
  const { handleAnswerChange } = useContext(ApplicationContext);
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
      <h2 className="question">{question.question}
      <Tooltip className="tooltip" title={question.description} placement="bottom-end" arrow>
            <span style={{ marginLeft: 7, verticalAlign: "middle", display: "inline-flex"}}>
              <TooltipIcon />
            </span>
          </Tooltip>
      </h2>
      <div className="optionContainer">
        {question.question_opt?.map((opt) => (
          <div key={opt} className="imageBoxContainer" onClick={() => handleInputChange(opt)}>
            <Checkbox checked={Boolean(input.find(x => x === opt))} />
            <div className="iconContainer">
              <GetSVG option={opt} />
            </div>
            <p>{opt}</p>
          </div>
        ))}
      </div>
      <div className='navBtnCont'>
        <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
        {question.id !== 31 && <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>}
      </div>
    </div>
  )
}

function GetSVG({ option }) {
  switch (option) {
    case "Pre-wash":
      return <img src='/images/icons/pre_wash.svg' alt={option} />
    case "During wash":
      return <img src='/images/icons/during_wash.svg' alt={option} />
    case "After wash (wet)":
      return <img src='/images/icons/after_wash_wet.svg' alt={option} />
    case "After wash (dry)":
      return <img src='/images/icons/after_wash_dry.svg' alt={option} />
    case "TV":
      return <img src='/images/icons/tv.svg' alt={option} />
    case "Digital":
      return <img src='/images/icons/digital.svg' alt={option} />
    case "Pack":
      return <img src='/images/icons/pack.svg' alt={option} />
    case "Point of sale":
      return <img src='/images/icons/point_of_sale.svg' alt={option} />
    default:
      return null
  }
}