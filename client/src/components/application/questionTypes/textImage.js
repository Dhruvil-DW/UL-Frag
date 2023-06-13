import { Autocomplete, TextField } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import UploadDoc from '../../../assets/uploadDoc/uploadDoc';
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function TextBoxImage({ question, nav, index, value = {desc: '', files: []}, onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange, handleFilesChange } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const defferInput = useDeferredValue(input);
  const [files, setFiles] = useState([]);
  const defferFiles = useDeferredValue(files);
  const [removeUploadedFiles, setRemoveUploadedFiles] = useState([]);

  const imageFileNames = [];
  function newFilesUpload(files){
    console.log(files);
    const Files = [...files];
    const newFiles = [];
    console.log('Files: ', Files);
    Files.forEach((element, i) => {
        const name = element.name.split(".");
        name.forEach(e => {
            name[0] = name[0] + `_` + uuidv4();
        })
        console.log(element.name);
        console.log(i);
        imageFileNames.push(name[0] + `.` + name[1]);
        const myRenamedFile = new File([element], name[0] + `.` + name[1],{ type: element.type});
        newFiles.push(myRenamedFile);
        // console.log(myRenamedFile);
        // Files[i].name = name[0]+`.`+name[1];
        console.log('newFiles :', newFiles);
        console.log('newFilesNames :', imageFileNames);
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
    console.log('ipdate',updatedFiles);
    setFiles((prevState) => [...prevState, ...updatedFiles]);
    setInput((prevState) => ({...prevState, files: [...prevState.files, ...imageFileNames]}));
  };

  // const onUpload = (files) => setInput((prevState) => [...prevState, ...files]);
  const onRemove = (removeFile) => {
    // newFilesUpload(removeFile);
    setFiles((prevState) => prevState.filter((file) => file !== removeFile));
    setInput((prevState) => ({...prevState, files: prevState.files.filter((file) => file !== removeFile)}));
  };
  const onRemoveUploaded = (removeFile) => {
    setRemoveUploadedFiles((prevState) => [...prevState, removeFile]);
    setInput((prevState) => ({ ...prevState, Images: prevState.Images.filter((file) => file.image_name !== removeFile) }));
    console.log('uploadedFiles', removeUploadedFiles, input);
  };

  useEffect(() => {
    handleAnswerChange(question.id, defferInput);
  }, [handleAnswerChange, question.id, defferInput]);


  useEffect(() => {
    if(defferFiles.length != 0){
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
          <TextField multiline rows={8} variant="outlined" name="desc" color="secondary" style={{ width: '100%'}} placeholder="Enter your description here" value={input.desc ?? ""} onChange={(e) => setInput(prevInput => ({ ...prevInput, [e.target.name]: e.target.value }))} />
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