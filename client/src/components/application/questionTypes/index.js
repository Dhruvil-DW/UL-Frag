import SelectMultiStatic from "./selectMultiStatic";
import SelectSingleStatic from "./selectSingleStatic";

export default function QuestionType({ question, inputs, onChange, onKeyUp }) {

  function handleAutoCompleteChange(__event, value, reason) {
    // const isArray = Array.isArray(value);
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
    onChange(question.id, value);
  }

  switch (question.question_type_id) {
    case 'singleselect':
      return <SelectSingleStatic question={question} value={inputs[question.id]} onChange={handleAutoCompleteChange} onKeyUp={onKeyUp} />
    case 'multiselect':
      return <SelectMultiStatic question={question} value={inputs[question.id]} onChange={handleAutoCompleteChange} onKeyUp={onKeyUp} />
    default:
      return null;
  }
}
