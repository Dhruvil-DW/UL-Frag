import { useContext } from "react";
import { ApplicationContext } from "../addApplication";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import { showPickerOnFocus } from "../../../utils/globalFunctions/showPickerOnFocus";
// import PlusRoundIcon from "../../../assets/icons/plusRoundIcon";
import TooltipIcon from "../../../assets/icons/tooltipIcon";
import Tooltip from "@mui/material/Tooltip";
import { getInputDate } from "../../../utils/globalFunctions/dateFns";

export default function NestedQuestion({ question, nav, index, onKeyUp }) {
  const { inputs, handleAnswerChange } = useContext(ApplicationContext);
  // console.log(question);
  // console.log(childQuestionData[question.id]);
  function handleNestedDateSelection(value, id, index) {
    const dateArr = inputs[id] ?? [];
    dateArr[index] = value;
    handleAnswerChange(id, dateArr);
  }

  function handleNestedAutoCompleteChange(__event, value, reason, id) {
    handleAnswerChange(id, value);
  }

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
            <div key={que.id} style={{ width: "100%", height: "40vh", padding: "1.5rem", backgroundColor: ["rgb(241, 245, 254)", "rgb(229, 235, 250)", "rgb(222, 231, 254)", "rgb(201 177 255)"][i], color: "hsl(221, 100%, 30%)" }}>
              <p style={{ fontSize: 18, marginTop: 0, marginBottom: 16 }}>{que.question}
                {que.description !== null && (
                  <Tooltip className="tooltip" title={que.description} placement="bottom-end" arrow>
                    <span style={{ marginLeft: 7 }}>
                      <TooltipIcon />
                    </span>
                  </Tooltip>

                )}
              </p>
              <div style={{ height: "calc(100% - 1.5rem)", overflow: "auto" }}>
                {question.id === 7 && (inputs[6]?.length ? (
                  <>
                    <Autocomplete
                      multiple
                      disablePortal
                      disableCloseOnSelect
                      fullWidth
                      options={inputs[6] ?? []}
                      value={inputs[que.id] ?? []}
                      onChange={(event, value, reason) => handleNestedAutoCompleteChange(event, value.map(obj => obj.label ?? obj), reason, que.id)}
                      isOptionEqualToValue={(option, value) => option === value}
                      disabled={!Boolean(inputs[6])}
                      popupIcon={<ArrowDownIcon />}
                      renderInput={(params) => <TextField {...params} variant="outlined" color="secondary" placeholder={inputs[que.id]?.length ? "" : "Select Market"} />}
                      renderOption={(params, option, { selected }) => (
                        <li {...params}>
                          <Checkbox color="secondary" name={que.id.toString()} checked={selected} />
                          {option}
                        </li>
                      )}
                      onKeyUp={onKeyUp}
                      sx={{ my: 3 }}
                    />
                  </>
                ) : (
                  <p style={{ fontSize: 14 }}>Please Select Country First</p>
                ))}
                {question.id === 11 && (
                  inputs[que.question_opt] ? inputs[que.question_opt].map((ans, index) => (
                    <div key={index} style={{ fontSize: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                      <p>{ans}</p>
                      <TextField type="date" className="whiteDatePicker" color="secondary" value={inputs[que.id]?.[index] ?? ""} onChange={(e) => handleNestedDateSelection(e.target.value, que.id, index)} inputProps={{ onFocus: showPickerOnFocus, min: getInputDate() }} />
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
