import { Checkbox, InputAdornment, TextField } from "@mui/material";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function CheckBoxImageWithTextBox({ question, nav, index, value = { option: [], desc: "" }, onKeyUp }) {
  const { handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);

  function handleInputChange(option) {

    //**Prevent Selection more than 2 */
    if (input.option?.length >= 2 && !(input.option?.includes(option))) {
      return;
    }

    setInput(prevInput => {
      const copyOpt = [...prevInput.option];
      const index = prevInput.option.indexOf(option);
      index === -1 ? copyOpt.push(option) : copyOpt.splice(index, 1);
      return { ...prevInput, option: copyOpt }
    });
  }

  function handleDescChange(e) {
    setInput(prevInput => ({ ...prevInput, desc: e.target.value }));
  }

  useEffect(() => {
    if (defferInput.desc?.length === 0 && defferInput.option?.length === 0) {
      handleAnswerChange(question.id, null);
    } else {
      handleAnswerChange(question.id, defferInput);
    }
  }, [handleAnswerChange, question.id, defferInput]);

  function BasicExample(nav) {
    const element = document.getElementById(nav);
    console.log('new nav', nav);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  const isInputValid = input.desc?.length < 1000;
  return (
    <>
      <div className="questionContainer">
        {/* {question.id === 23 &&
        <p className="addText">Performance input</p>
      } */}
        {/* <h2 className="question">
          {`${question.CatWiseQueIndex} ${question.id === 23 ? "Performance input: " : ""}${question.question}`}
        </h2> */}
        <h2 className="question">
          <span style={{ marginRight: 7 }}>{question.CatWiseQueIndex}</span>
          <span>
            <span className="addText">{question.id === 23 ? "Performance input: " : ""}</span>
            {question.question}
          </span>
        </h2>
        <div style={{ fontSize: 14, color: "#00000080", margin: "-12px 0 -12px auto" }}>You can select any two of them</div>
        <div className="optionContainer">
          {question.question_opt?.map((opt) => (
            <div key={opt} className="imageBoxContainer" onClick={() => handleInputChange(opt)}>
              <Checkbox checked={Boolean(input.option?.find(x => x === opt))} />
              <div className="iconContainer">
                <GetSVG option={opt} />
              </div>
              <p>{opt}</p>
            </div>
          ))}
        </div>

        <div>
          <TextField multiline fullWidth rows={2} inputProps={{ maxLength: 1000 }} InputProps={{ endAdornment: <InputAdornment sx={{ position: "absolute", right: 16, bottom: 16, color: "hsl(0, 0%, 90%)" }} position="end">{`${input.desc?.length ?? 0} / 1000`}</InputAdornment> }} variant="outlined" color="secondary" placeholder="Enter your description here" value={input.desc} onChange={handleDescChange} />
          {/* <div style={{ position: "absolute", bottom: 8, right: 24, color: "hsl(0, 0%, 60%)" }}>{`${input.length ?? 0} / 1000`}</div> */}
          {!isInputValid && (
            <p style={{ fontSize: 12, color: 'red', marginLeft: '21px' }}>
              Input length should not exceed 1000 characters.
            </p>
          )}
        </div>

        {/* <div style={{position: "absolute", display: "flex", justifyContent: "center", width: "100%", fontSize: 14, bottom: "-3rem", color: "#00000080"}}>You can select only two of them</div> */}
        <div className='navBtnCont'>
          <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
          {question.id !== 31 && <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>}
          {/* <p className="checkBxTxt">You can select only two of them</p> */}
        </div>
      </div>
    </>
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