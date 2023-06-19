import { Autocomplete, TextField } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import UploadDoc from '../../../assets/uploadDoc/uploadDoc';
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function TextBoxImage({ question, nav, index, value, onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange, handleFilesChange, handleImageInputChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value ? value : { desc: '', files: [] });
  const defferInput = useDeferredValue(input);
  const [files, setFiles] = useState([]);
  const defferFiles = useDeferredValue(files);
  const [removeUploadedFiles, setRemoveUploadedFiles] = useState([]);
  const [imageInput, setImageInput] = useState([]);
  const defferImageInput = useDeferredValue(imageInput);

  const imageFileNames = [];
  function newFilesUpload(files) {
    console.log(files);
    const Files = [...files];
    const newFiles = [];
    console.log('Files: ', Files);
    Files.forEach((element, i) => {
      const fileNameArr = element.name.split(".");
      const fileExt = fileNameArr.pop();
      const renamedFileName = `${fileNameArr.join(".")}_${uuidv4().slice(0, 8)}.${fileExt}`;
      imageFileNames.push(renamedFileName);
      const myRenamedFile = new File([element], renamedFileName, { type: element.type });
      newFiles.push(myRenamedFile);
    });
    return newFiles;
  }

  // const onUpload = (files) => {
  //   const updatedFiles = newFilesUpload(files);
  //   console.log(updatedFiles);
  //   setFiles((prevState) => [...prevState, ...updatedFiles]);
  //   setInput((prevState) => ({...prevState, files: [...prevState.files, ...updatedFiles]}));
  // };

  const onUpload = (files) => {
    const updatedFiles = newFilesUpload(files);
    console.log('ipdate', updatedFiles);
    setFiles((prevState) => ([...prevState, ...updatedFiles]));
    // setInput((prevState) => ({...prevState, files: [...prevState.files, ...imageFileNames]}));
    setImageInput((prevState) => ([...prevState, ...imageFileNames]));
  };

  // const onUpload = (files) => setInput((prevState) => [...prevState, ...files]);
  const onRemove = (removeFile) => {
    // newFilesUpload(removeFile);
    setFiles((prevState) => prevState.filter((file) => file !== removeFile));
    // setInput((prevState) => ({...prevState, files: prevState.files.filter((file) => file !== removeFile)}));
    let inputsImageArr = [...imageInput];
    const newRemoveArr = inputsImageArr.filter((file) => file !== removeFile.name);
    setImageInput(newRemoveArr);
    // setImageInput((prevState) => ({...prevState, files: prevState.files.filter((file) => file !== removeFile)}));
  };

  const onRemoveUploaded = (removeFile) => {
    setRemoveUploadedFiles((prevState) => [...prevState, removeFile]);
    setInput((prevState) => ({ ...prevState, Images: prevState.Images.filter((file) => file.image_name !== removeFile) }));
    console.log('uploadedFiles', removeUploadedFiles, input);
  };

  useEffect(() => {
    if (defferInput.desc.length !== 0) {
      handleAnswerChange(question.id, defferInput);
    } else {
      handleAnswerChange(question.id, null);
    }
    // handleAnswerChange(question.id, defferInput);
  }, [handleAnswerChange, question.id, defferInput]);

  useEffect(() => {
    if (defferImageInput.length != 0) {
      handleImageInputChange(question.id, defferImageInput, question.question_type_id);
    }
  }, [handleImageInputChange, question.id, defferImageInput, question.question_type_id]);

  useEffect(() => {
    if (defferFiles.length != 0) {
      handleFilesChange(question.id, defferFiles);
    }
  }, [handleFilesChange, question.id, defferFiles]);

  function BasicExample(nav) {
    const element = document.getElementById(nav);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  return (
    <div className="questionContainer">
      <div style={{ display: "flex", gap: "3rem" }}>
        <div className="queBox">
          <h2 className="question">{question.question}</h2>
          <TextField multiline rows={8} variant="outlined" name="desc" color="secondary" style={{ width: '100%' }} placeholder="Enter your description here" value={input.desc ?? ""} onChange={(e) => setInput(prevInput => ({ ...prevInput, [e.target.name]: e.target.value }))} />
        </div>
        <div className="uploadContainer">
          <UploadDoc que_id={question.id} label='Upload Cabin Photos' files={files} uploadedFiles={input.files} onUpload={onUpload} onRemove={onRemove} onRemoveUploaded={onRemoveUploaded} required={false} />
        </div>
      </div>
      <div className='navBtnCont'>
        <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
        <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}