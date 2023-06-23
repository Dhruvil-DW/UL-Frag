import { Autocomplete, Checkbox, TextField } from "@mui/material";
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function SelectMultiStatic({ question, nav, index, value = [], onKeyUp }) {
  const { inputs, country, handleAnswerChange, resetMarket } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);

  function handleInputChange(__event, value, __reason) {
    setInput(value);
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
  function handelMarketSelect(event, value, reason) {
    if (reason === "clear" || reason === "selectOption") {
      resetMarket();
    }
    handleInputChange(event, value.map(obj => obj.label ?? obj), reason)
  }

  return (
    <div className="questionContainer fixWidth">
      <h2 className="question">{question.question}</h2>
      {question.id === 6 ? (
        <>
          <Autocomplete
            multiple
            disablePortal
            disableCloseOnSelect
            options={country ?? []}
            value={inputs[question.id] ?? []}
            onChange={handelMarketSelect}
            isOptionEqualToValue={(option, value) => option.label === value}
            disabled={!Boolean(inputs[5])}
            popupIcon={<ArrowDownIcon />}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" color="secondary"
                placeholder={inputs[question.id]?.length ? "" : "Enter Country"} />
            )}
            renderOption={(params, option, { selected }) => (
              <li {...params}>
                <Checkbox checked={selected} />
                {option.label}
              </li>
            )}
            onKeyUp={onKeyUp}
          />
          {!Boolean(inputs[5]) ? <p style={{ fontSize: 12, color: "red", margin: '-0.3rem 0px 0px 21px' }}>*Please select Business Unit first</p> : ''}
          {/* <p style={{fontSize: 12, color:"red", margin:'-0.3rem 0px 0px 21px' }}>*Please select Business Unit first</p> */}
        </>
      ) : (
        <Autocomplete
          multiple
          disablePortal
          disableCloseOnSelect
          options={question.question_opt ?? []}
          value={input}
          onChange={handleInputChange}
          popupIcon={<ArrowDownIcon />}
          renderInput={(params) => <TextField {...params} variant="outlined" color="secondary" placeholder={input?.length ? "" : "Select Format"} />}
          renderOption={(params, option, { selected }) => (
            <li {...params}>
              <Checkbox checked={selected} />
              {option}
            </li>
          )}
          onKeyUp={onKeyUp}
        />
      )}
      <div className='navBtnCont'>
        <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
        <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}