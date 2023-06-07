import { Autocomplete, TextField } from "@mui/material";
import UploadDoc from '../../../assets/uploadDoc/uploadDoc';
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function TextBoxImage({ question, nav, index, value = "", onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);
  const [removeUploadedFiles, setRemoveUploadedFiles] = useState([]);

  const [files, setFiles] = useState([]);
  const onUpload = (files) => setFiles((prevState) => [...prevState, ...files]);
  const onRemove = (removeFile) => setFiles((prevState) => prevState.filter((file) => file !== removeFile));
  const onRemoveUploaded = (removeFile) => {
    setRemoveUploadedFiles((prevState) => [...prevState, removeFile]);
    setInput((prevState) => ({ ...prevState, Images: prevState.Images.filter((file) => file.image_name !== removeFile) }));
    console.log('uploadedFiles', removeUploadedFiles, input);
  };

  useEffect(() => {
    handleAnswerChange(question.id, defferInput);
  }, [handleAnswerChange, question.id, defferInput]);

  function BasicExample(nav) {
    const element = document.getElementById(nav);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
}
  return (
    <div className="questionContainer">
      <h2 className="question">{question.question}</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
      <TextField multiline rows={8} variant="outlined" color="secondary" placeholder="Enter your description here" value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="uploadContainer">
          <UploadDoc label='Upload Cabin Photos' files={files} uploadedFiles={input.Images} onUpload={onUpload} onRemove={onRemove} onRemoveUploaded={onRemoveUploaded} required={false} />
        </div>
        </div>
      <div className='navBtnCont'>
        <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
          <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}