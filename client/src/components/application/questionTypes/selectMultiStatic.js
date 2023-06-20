import { Autocomplete, Checkbox, TextField } from "@mui/material";
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function SelectMultiStatic({ question, nav, index, value = [], onKeyUp }) {
  const { inputs, country, handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);
  
  function handleInputChange(__event, value, __reason) {
    // switch (reason) {
    //   case "selectOption":
    //   case "removeOption":
    //     // value = isArray ? option.map(x => x.id) : option.id
    //     break;
    //   case "clear":
    //     // value = isArray ? [] : null;
    //     break;
    //   case "createOption":
    //   case "blur":
    //   default:
    //     return;
    // }===
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

  return (
    <div className="questionContainer fixWidth">
      <h2 className="question">{question.question}</h2>
      {question.id === 6 ? (
        <Autocomplete
          multiple
          disablePortal
          disableCloseOnSelect
          options={country ?? []}
          value={inputs[question.id] ?? []}
          onChange={(event, value, reason) => handleInputChange(event, value.map(obj => obj.label ?? obj), reason)}
          isOptionEqualToValue={(option, value) => option.label === value}
          disabled={!Boolean(inputs[5])}
          popupIcon={<ArrowDownIcon />}
          renderInput={(params) => <TextField {...params} variant="outlined" color="secondary" placeholder="Enter Country"/>}
          renderOption={(params, option, { selected }) => (
            <li {...params}>
              <Checkbox color="secondary" name="location" checked={selected} />
              {option.label}
            </li>
          )}
          onKeyUp={onKeyUp}
        />
      ) : (
        <Autocomplete
          multiple
          disablePortal
          disableCloseOnSelect
          options={question.question_opt ?? []}
          value={input}
          onChange={handleInputChange}
          popupIcon={<ArrowDownIcon />}
          renderInput={(params) => <TextField {...params} variant="outlined" color="secondary" placeholder="Select Format"/>}
          renderOption={(params, option, { selected }) => (
            <li {...params}>
              <Checkbox color="secondary" name="location" checked={selected} />
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