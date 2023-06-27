import CheckBoxConfirm from "./checkboxConfirm";
import CheckBoxImage from "./checkboxMultiImage";
import NestedQuestion from "./nestedQuestion";
import RadioImage from "./radioImage";
import RadioText from "./radioText";
import SelectMultiStatic from "./selectMultiStatic";
import SelectSingleStatic from "./selectSingleStatic";
import SelectSingleWithTextStatic from "./selectSingleTextField";
import TextBoxImage from "./textImage";
import TextBoxVariationImage from "./textImageVariation";
import TextBox from "./textBox";
import SelectCategory from "./selectCategory";
import RadioTextInvestment from "./radioTextInvestment";
import CheckBoxImageWithTextBox from "./checkboxMultiImageWithTextBox";
import { useContext } from "react";
import { ApplicationContext } from "../addApplication";

export default function QuestionType({ question, nav, index, onKeyUp }) {

  const { inputs } = useContext(ApplicationContext);

  // console.log(question);
  switch (question.question_type_id) {
    case 1: // TextBox
      return <TextBox question={question} nav={nav} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />

    case 3: //Select Dropdown predefined
    case 4: // Select Dropdown dynamic
      return question.id === 3
        ? <SelectCategory question={question} nav={nav} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />
        : <SelectSingleStatic question={question} nav={nav} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />

    case 5: //Multiselect Dropdown predefined
    case 6: // Multiselect dropdown dynamic
      return <SelectMultiStatic question={question} nav={nav} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />

    case 7: // Picture Choice predefined
      return <RadioImage question={question} nav={nav} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />

    case 8: // Multiselect Picture Choice
      return question.id === 23
      ? <CheckBoxImageWithTextBox question={question} nav={nav} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />
      : <CheckBoxImage question={question} nav={nav} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />

    case 10: // Single Choice predefinded
      return question.id === 24
        ? <RadioTextInvestment question={question} nav={nav} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />
        : <RadioText question={question} nav={nav} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />

    case 11: // Multiple Choice (Checkbox) predefined
    case 15: // Confirm Checkbox
      return <CheckBoxConfirm question={question} nav={nav} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />

    case 12: // Nested questions
      return <NestedQuestion question={question} nav={nav} index={index} onKeyUp={onKeyUp} />

    case 14: //Select (RadioButton) with TextBox
      return <SelectSingleWithTextStatic question={question} nav={nav} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />
      
    case 13: //Add multiple image (uploadDoc) with TextBox
      return <TextBoxImage question={question} nav={nav} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />

    case 9: // Add Multiple section Image Upload
      return <TextBoxVariationImage question={question} nav={nav} index={index} value={inputs[question.id]} onKeyUp={onKeyUp} />

    case 2: // Date
    default:
      return null;
  }
}
