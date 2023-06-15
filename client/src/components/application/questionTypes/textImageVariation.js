import { Autocomplete, TextField } from "@mui/material";
import { Button } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import UploadDocVariation from '../../../assets/uploadDoc/uploadDocVariation';
import ArrowDownIcon from "../../../assets/icons/arrowDownIcon";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function TextBoxVariationImage({ question, nav, index, value = [{ variation: '', files: [] }], onKeyUp }) {
  const { handleNextPrevNav, handleAnswerChange, handleFilesChange, handleRemoveFilesChange, handleRemoveFiles } = useContext(ApplicationContext);
  const [input, setInput] = useState(value);
  const [count, setSectionCount] = useState(1);
  const defferInput = useDeferredValue(input);
  const [files, setFiles] = useState([]);
  const [variantFiles, setVariantFiles] = useState([]);
  const defferFiles = useDeferredValue(files);
  const [removeUploadedFiles, setRemoveUploadedFiles] = useState([]);
  const defferRemoveFiles = useDeferredValue(removeUploadedFiles);

  const imageFileNames = [];
  function newFilesUpload(files) {

    const Files = [...files];
    const newFiles = [];
    Files.forEach((element, i) => {
      const name = element.name.split(".");
      name.forEach(e => {
        name[0] = name[0] + `_` + uuidv4();
      })
      imageFileNames.push(name[0] + `.` + name[1]);
      const myRenamedFile = new File([element], name[0] + `.` + name[1], { type: element.type });
      newFiles.push(myRenamedFile);
    });
    return newFiles;
  }

  const onUpload = (i, files) => {
    const updatedFiles = newFilesUpload(files);
    let newArr = [...variantFiles];
    newArr[i] = updatedFiles;
    let inputsArr = [...input];
    setFiles((prevState) => [...prevState, ...updatedFiles]);
    setVariantFiles((prevState) => {
      const newState = [...prevState];
      newState[i] = newState[i] ? [...newState[i], ...updatedFiles] : updatedFiles;
      return newState;
    });
    inputsArr[i].files = imageFileNames;
    // setInput((prevState) => ({ ...prevState, files: [...prevState.files, ...imageFileNames] }));
  };

  const addVariation = () => {
    // let inputsArr = [...input];
    // inputsArr.push({ variation: '', files: [] });
    setInput((inputsArr) => [...inputsArr, { variation: '', files: [] }]);
  }

  const removeVariation = (i) => {
    // console.log(input);
    // console.log(i)
    const remove_images = input[i];
    console.log('remove images',remove_images.files);
    remove_images.files.map((f, i) => (
      setFiles((prevState) => prevState.filter((file) => file.name !== f))
    ));
    setRemoveUploadedFiles((prevState) => [...prevState , ...remove_images.files]);
    input.splice(i, 1);
    variantFiles.splice(i, 1);
    setInput([...input]);
  }

  const removeSingleFile = (index, inner_index) => {
    let inputsArr = [...input];
    inputsArr[index].files.splice(inner_index, 1);
    setInput(inputsArr);
    // console.log("inputs", input);
  }

  const handleChange = (i, e) => {
    // console.log('divyarajsinh');
    let inputsArr = [...input];
    // console.log(e)
    if (e.target.name === 'variation') {
      inputsArr[i].variation = e.target.value;
    }
    setInput(inputsArr);
    console.log("inputs", input);
  };


  console.log('hey files', files);
  // const onUpload = (files) => setInput((prevState) => [...prevState, ...files]);
  const onRemove = (index, removeFile, inner_index) => {

    setFiles((prevState) => prevState.filter((file) => file !== removeFile));
    setVariantFiles((prevState) => {
      const newState = [...prevState];
      newState[index] = newState[index] ? newState[index].filter((file) => file !== removeFile) : removeFile;
      console.log(newState[index]);
      return newState;
    });
    setVariantFiles((prevState) => prevState.filter((file) => file !== removeFile));
    let inputsArr = [...input];
    inputsArr[index].files.splice(inner_index, 1);
    setInput(inputsArr);
    console.log("inputs", input);
    // setInput((prevState) => ({ ...prevState, files: prevState.files.filter((file) => file !== removeFile) }));
  };
  const onRemoveUploaded = (removeFile) => {
    console.log(removeFile);
    setRemoveUploadedFiles((prevState) => [...prevState, removeFile]);
    console.log('remove image',removeUploadedFiles);
    console.log('inputs', input);
    // setInput((prevState) => ({ ...prevState, files: prevState.files.filter((file) => file !== removeFile) }));
    setInput((prevState) => {
      // console.log(prevState);
      const new_value = prevState.map((file)=>{
        console.log(file);
        const remaining_files = file.files.filter((image)=> image !== removeFile)
        return { ...file, files: remaining_files };
      })
      return new_value;
    });
    console.log('uploadedFiles', removeUploadedFiles, input);
  };

  useEffect(() => {
    handleAnswerChange(question.id, defferInput);
  }, [handleAnswerChange, question.id, defferInput]);

  useEffect(() => {
    if (defferFiles.length != 0) {
      handleFilesChange(question.id, defferFiles);
    }
  }, [handleFilesChange, question.id, defferFiles]);

  useEffect(() => {
    if (defferRemoveFiles.length != 0) {
      handleRemoveFilesChange(question.id, defferRemoveFiles);
    }
  }, [handleRemoveFilesChange, question.id, defferRemoveFiles]);

  useEffect(() => {
    if (defferRemoveFiles.length != 0) {
      console.debug('defur remove files',defferRemoveFiles);
      handleRemoveFiles(question.id, defferRemoveFiles);
    }
  }, [handleRemoveFiles, question.id, defferRemoveFiles]);

  function BasicExample(nav) {
    const element = document.getElementById(nav);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  console.log('edit input', input)

  return (
    <div className="questionContainer">
      <div style={{ display: "flex", gap: "3rem" }}>
        <div className="queBox">
          <h2 className="question">{question.question}</h2>
          {input.map((element, index) => (
            <div key={index} style={{ display: "flex", gap: "3rem" }}>
              <div style={{ display: "grid", gap: "15rem" }}>
              <TextField variant="outlined" name="variation" color="secondary" placeholder="Variation name" value={element.variation ?? ""} onChange={(e) => handleChange(index, e)} />
              {input.length > 1 && (<Button variant="outlined" color="secondary" style={{ width: 'auto' }} onClick={() => removeVariation(index)}>remove Variation</Button>)}
              </div>
              <div className="uploadContainer">
                <UploadDocVariation que_id={question.id} label='Upload Cabin Photos' files={variantFiles[index] ?? []} uploadedFiles={element.files} onUpload={(e) => onUpload(index, e)} onRemove={(e, i) => onRemove(index, e, i)} onRemoveUploaded={onRemoveUploaded} required={false} />
              </div>
              
            </div>
          ))}
        </div>
      </div>
      <Button variant="outlined" color="secondary" style={{ width: '10%' }} onClick={addVariation}>Add Variation</Button>
      <div className='navBtnCont'>
        <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
        <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}