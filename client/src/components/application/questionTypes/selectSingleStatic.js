import { Autocomplete, TextField } from "@mui/material";
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";

export default function SelectSingleStatic({ question, onChange, value = null, onKeyUp }) {

  return (
    <div className="questionContainer">
      <h2 className="question">{question.question}</h2>
      <Autocomplete
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