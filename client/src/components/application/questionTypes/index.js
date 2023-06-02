import NestedQuestion from "./nestedQuestion";
import RadioImage from "./radioImage";
import RadioText from "./radioText";
import SelectMultiStatic from "./selectMultiStatic";
import SelectSingleStatic from "./selectSingleStatic";

export default function QuestionType({ question, index, inputs, onChange, onKeyUp }) {

  function handleNestedDateSelection(value, id, index) {
    //Used in: NestedQuestions 
    const dateArr = inputs[id] ?? [];
    dateArr[index] = value;
    onChange(id, dateArr);
  }

  function handleNestedAutoCompleteChange(__event, value, reason, id) {
    //Used in: NestedQuestions 
    // debugger;
    switch (reason) {
      case "selectOption":
      case "removeOption":
        // value = isArray ? option.map(x => x.id) : option.id
        break;
      case "clear":
        // value = isArray ? [] : null;
        break;
      case "createOption":
      case "blur":
      default:
        return;
    }
    onChange(id, value);
  }

  // console.log(question);
  switch (question.question_type_id) {
    case 3: //Select Dropdown predefined
      return <SelectSingleStatic question={question} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />

    case 5: //Multiselect Dropdown predefined
      return <SelectMultiStatic question={question} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />

    case 7: // Picture Choice predefined
      return <RadioImage question={question} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />

    case 12: // Nested questions
      return <NestedQuestion question={question} index={index} inputs={inputs} onChange={handleNestedAutoCompleteChange} onDateSelect={handleNestedDateSelection} onKeyUp={onKeyUp} />

    case 13: // RadioText
      return <RadioText question={question} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />

    case 1: // Text
    case 2: // Date
    case 4: // Select Dropdown dynamic
    case 6: // Multiselect dropdown dynamic
    case 8: // Multiselect Picture Choice
    case 9: // Add Multiple section
    case 10: // Multiple Choice predefined
    case 11: // Multiple Choice dynamic
    default:
      return null;
  }
}
