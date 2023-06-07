import { useContext } from "react";
import { ApplicationContext } from "../addApplication";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import { showPickerOnFocus } from "../../../utils/globalFunctions/showPickerOnFocus";
// import PlusRoundIcon from "../../../assets/icons/plusRoundIcon";
import TooltipIcon from "../../../assets/icons/tooltipIcon";
import Tooltip from "@mui/material/Tooltip";

export default function NestedQuestion({ question, nav, index, onChange, onDateSelect, inputs = {}, onKeyUp }) {
  const { handleNextPrevNav } = useContext(ApplicationContext);
  // console.log(question);
  // console.log(childQuestionData[question.id]);

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

      <div className="nestedQueWrapper">
        <div className="nestedQueContainer" style={{ display: "flex", color: "white", marginRight: "2rem" }}>
          {question.nestedQue.map((que, i) => (
            <div key={que.id} style={{ width: "100%", height: "40vh", padding: "1.5rem", backgroundColor: ["#FFBCD8", "#F8E075", "#8FD7F6"][i] }}>
              <p style={{ fontSize: 18, marginTop: 0, marginBottom: 16 }}>{que.question}
              {que.description !== null && (
                <Tooltip className="tooltip" title={que.description} placement="bottom-end" arrow>
                  <span style={{marginLeft:7}}>
                <TooltipIcon/>
                </span>
                </Tooltip>

              )}
            </p>
            <div style={{ height: "calc(100% - 1.5rem)", overflow: "auto" }}>
              {question.id === 7 && (
                <>
                  <Autocomplete
                    multiple
                    disablePortal
                    disableCloseOnSelect
                    fullWidth
                    options={que.question_opt ?? []}
                    value={inputs[que.id] ?? []}
                    onChange={(event, value, reason) => onChange(event, value, reason, que.id)}
                    popupIcon={<ArrowDownIcon />}
                    renderInput={(params) => <TextField {...params} variant="outlined" color="secondary" placeholder="Select Market" />}
                    renderOption={(params, option, { selected }) => (
                      <li {...params}>
                        <Checkbox color="secondary" name={que.id.toString()} checked={selected} />
                        {option}
                      </li>
                    )}
                    onKeyUp={onKeyUp}
                    sx={{ my: 3 }}
                  />
                  {/* <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <PlusRoundIcon style={{ fontSize: 24 }} />
                    <p style={{ fontSize: 12 }}>Add another market</p>
                  </div> */}
                </>
              )}
              {question.id === 11 && (
                inputs[que.question_opt] ? inputs[que.question_opt].map((ans, index) => (
                  <div key={index} style={{ fontSize: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                    <p>{ans}</p>
                    <TextField type="date" className="whiteDatePicker" value={inputs[que.id]?.[index] ?? ""} onChange={(e) => onDateSelect(e.target.value, que.id, index)} inputProps={{ onFocus: showPickerOnFocus }} />
                  </div>
                )) : <p style={{ fontSize: 14 }}>Please Select Market First</p>
              )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='navBtnCont'>
          <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
          <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}
