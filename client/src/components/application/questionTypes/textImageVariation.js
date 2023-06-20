import { Autocomplete, TextField } from "@mui/material";
import { Button } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import UploadDocVariation from '../../../assets/uploadDoc/uploadDocVariation';
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";

export default function TextBoxVariationImage({ question, nav, index, value, onKeyUp }) {
  const { handleNextPrevNav, handleImageInputChange, handleAnswerChange, handleFilesChange, handleRemoveFilesChange, handleRemoveFiles } = useContext(ApplicationContext);
  const [input, setInput] = useState(value ? value : [{ variation: '', files: [] }]);
  const defferInput = useDeferredValue(input);
  const [imageInput, setImageInput] = useState([{ files: [] }]);
  const defferImageInput = useDeferredValue(imageInput);
  const [count, setSectionCount] = useState(1);
  const [files, setFiles] = useState([]);
  const defferFiles = useDeferredValue(files);
  const [variantFiles, setVariantFiles] = useState([]);
  const [removeUploadedFiles, setRemoveUploadedFiles] = useState([]);
  const defferRemoveFiles = useDeferredValue(removeUploadedFiles);

  const imageFileNames = [];
  function newFilesUpload(files) {
    const Files = [...files];
    const newFiles = [];
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

  const onUpload = (i, files) => {
    const updatedFiles = newFilesUpload(files);
    let newArr = [...variantFiles];
    newArr[i] = updatedFiles;
    let inputsArr = [...input];
    let imageInputs = [...imageInput];
    setFiles((prevState) => [...prevState, ...updatedFiles]);
    setVariantFiles((prevState) => {
      const newState = [...prevState];
      newState[i] = newState[i] ? [...newState[i], ...updatedFiles] : updatedFiles;
      return newState;
    });
    console.debug('image files', imageFileNames);

    // let index = i;
    // let new_files = imageFileNames;
    imageInputs[i].files = imageFileNames;
    setImageInput(imageInputs);
    console.debug('new image uploads', imageInput)

    // inputsArr[i].files = imageFileNames;
    // setInput((prevState) => ({ ...prevState, files: [...prevState.files, ...imageFileNames] }));

  };

  const addVariation = () => {
    setInput((inputsArr) => [...inputsArr, { variation: '', files: [] }]);
    setImageInput((imageInputs) => [...imageInputs, { files: [] }]);
  }

  const removeVariation = (i) => {
    // console.log(input);
    // console.log(i)
    const remove_images = input[i];
    console.log('remove images', remove_images.files);
    remove_images.files.map((f, i) => (
      setFiles((prevState) => prevState.filter((file) => file.name !== f))
    ));
    setRemoveUploadedFiles((prevState) => [...prevState, ...remove_images.files]);
    input.splice(i, 1);
    imageInput.splice(i, 1);
    variantFiles.splice(i, 1);
    setInput([...input]);
    setImageInput([...imageInput]);
    console.debug('after variant remove', imageInput)

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


  const onRemove = (index, removeFile, inner_index) => {
    handleRemoveFiles(question.id, removeFile);
    setFiles((prevState) => prevState.filter((file) => file !== removeFile));
    setVariantFiles((prevState) => {
      const newState = [...prevState];
      newState[index] = newState[index] ? newState[index].filter((file) => file !== removeFile) : removeFile;
      return newState;
    });

    setVariantFiles((prevState) => prevState.filter((file) => file !== removeFile));
    let inputsArr = [...input];
    inputsArr[index].files.splice(inner_index, 1);
    setInput(inputsArr);
    let inputsImageArr = [...imageInput];
    inputsImageArr[index].files.splice(inner_index, 1);
    setImageInput(inputsImageArr);
  };

  const onRemoveUploaded = (removeFile) => {
    console.log(removeFile);
    setRemoveUploadedFiles((prevState) => [...prevState, removeFile]);
    setInput((prevState) => {
      const new_value = prevState.map((file) => {
        console.log(file);
        const remaining_files = file.files.filter((image) => image !== removeFile)
        return { ...file, files: remaining_files };
      })
      return new_value;
    });
  };

  useEffect(() => {
    let isNull = true;
    for (const value of defferInput) {
      if (value.variation.length !== 0) {
        isNull = false;
        break;
      }
    }
    if (isNull) {
      handleAnswerChange(question.id, null);
    } else {
      handleAnswerChange(question.id, defferInput);
    }
  }, [handleAnswerChange, question.id, defferInput]);

  useEffect(() => {
    if (defferRemoveFiles.length != 0) {
      handleRemoveFilesChange(question.id, defferRemoveFiles);
    }
  }, [handleRemoveFilesChange, question.id, defferRemoveFiles]);

  
  useEffect(() => {
    if (defferFiles.length != 0) {
      handleFilesChange(question.id, defferFiles);
      // handleRemoveFiles(question.id, defferFiles);
    }
  }, [handleRemoveFiles, question.id, defferFiles]);

  // to upload new files
  // useEffect(() => {
  //   if (defferFiles.length != 0) {
  //     handleFilesChange(question.id, defferFiles);
  //   }
  // }, [handleFilesChange, question.id, defferFiles]);

  useEffect(() => {
    if (defferImageInput.length != 0) {
      handleImageInputChange(question.id, defferImageInput, question.question_type_id);
    }
  }, [handleImageInputChange, question.id, defferImageInput, question.question_type_id]);

  function BasicExample(nav) {
    const element = document.getElementById(nav);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div data-que-type={question.question_type_id} className="questionContainer">
      <div style={{ display: "flex", gap: "3rem" }}>
        <div className="queBox">
          <h2 className="question">{question.question}</h2>
          <div className="variation_list">
            {input.map((element, index) => (
              <div key={index} style={{ display: "flex", gap: "3rem", marginBottom: 30 }}>
                <div style={{ display: "grid", gap: "0", width: "45%" }}>
                  <TextField variant="outlined" name="variation" color="secondary" placeholder="Variation name" value={element.variation ?? ""} onChange={(e) => handleChange(index, e)} />
                  {input.length > 1 && (<Button variant="outlined" color="secondary" style={{ width: 'auto', maxWidth: 500, height: '40%' }} onClick={() => removeVariation(index)}>- Remove Variation</Button>)}
                </div>
                <div className="uploadContainer">
                  <UploadDocVariation que_id={question.id} label='Upload Cabin Photos' files={variantFiles[index] ?? []} uploadedFiles={element.files} onUpload={(e) => onUpload(index, e)} onRemove={(e, i) => onRemove(index, e, i)} onRemoveUploaded={onRemoveUploaded} required={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button variant="outlined" color="secondary" style={{ width: '45%', maxWidth: 500 }} onClick={addVariation}>+ Add New Variation</Button>
      <div className='navBtnCont'>
        <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
        <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}