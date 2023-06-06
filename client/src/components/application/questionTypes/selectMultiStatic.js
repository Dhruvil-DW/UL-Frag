import { Autocomplete, Checkbox, TextField } from "@mui/material";
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function SelectMultiStatic({ question, nav, index, value = [], onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange } = useContext(ApplicationContext);
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

  return (
    <div className="questionContainer">
      <h2 className="question">{question.question}</h2>
      <Autocomplete
        multiple
        disablePortal
        disableCloseOnSelect
        options={question.question_opt ?? []}
        value={input}
        onChange={handleInputChange}
        popupIcon={<ArrowDownIcon />}
        renderInput={(params) => <TextField {...params} variant="outlined" color="secondary" placeholder="Select Options" />}
        renderOption={(params, option, { selected }) => (
          <li {...params}>
            <Checkbox color="secondary" name="location" checked={selected} />
            {option}
          </li>
        )}
        onKeyUp={onKeyUp}
      />
      <div className='navBtnCont'>
        <a href={`#${(nav) - 1}`} className="navlink">
          <div className="prevBtn" tabIndex={-1} onClick={() => handleNextPrevNav(index, 'prev')}><ArrowLeftRoundIcon /></div>
        </a>
        <a href={`#${(nav) + 1}`} className="navlink">
          <div className="nextBtn" tabIndex={-1} onClick={() => handleNextPrevNav(index, 'next')}><ArrowLeftRoundIcon /></div>
        </a>
      </div>
    </div>
  )
}