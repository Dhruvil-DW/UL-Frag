import { Autocomplete, TextField } from "@mui/material";
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";

export default function SelectMultiStatic({ question, onChange, value = [], onKeyUp }) {
  return (
    <div className="questionContainer">
      <h2 className="question">{question.question}</h2>
       <Autocomplete
        multiple
        disablePortal
        options={question.question_opt}
        value={value}
        onChange={onChange}
        popupIcon={<ArrowDownIcon />}
        renderInput={(params) => <TextField {...params} variant="outlined" color="secondary" />}
        onKeyUp={onKeyUp}
        sx={{minWidth: 300}}
      />
    </div>
  )
}