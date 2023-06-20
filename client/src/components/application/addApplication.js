import { Button } from "@mui/material";
import { Fragment, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import QuestionType from "./questionTypes";
import NavSideBar from "./navSideBar";
import debounce from "../../utils/globalFunctions/debounce";
// import { useParams } from "react-router";
import UnileverIcon from "../../assets/icons/unileverIcon";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorBoundary from "../../config/errorBoundary/ErrorBoundary";
import WelcomeScreen from "./welcomeScreen/welcomeScreen";
import { useAxios } from "../../hooks/useAxios";
import { promptActions, promptContext } from "../../context/promptContext";
export const ApplicationContext = createContext();

export default function AddApplication() {
  const { appId } = useParams();
  const { promptDispatch } = useContext(promptContext);
  const navigate = useNavigate();
  const [catWiseQues, setCatWiseQues] = useState([]);
  const [inputs, setInputs] = useState({});
  const [imageInputs, setImageInputs] = useState({});
  const [allFiles, setAllFiles] = useState([]);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [regions, setRegions] = useState([]);
  const [country, setCountry] = useState([]);
  const containerRef = useRef(null);
  const { getData, postData } = useAxios();

  // console.log("INPUTS: ", inputs);
  function getQuestions() {
    if (appId) {
      getData(`/application/getdraft/${appId}`, {}, (data) => {
        setInputs(data.inputs);
      });
    }
    getData(`/application/questions/getall`, {}, (data) => {
      const newData = getCatWiseQues(data);
      setCatWiseQues(newData);
    });
  }

  function getRegions() {
    getData("application/getregions", {}, setRegions);
  }

  function getCountry() {
    if (inputs[5]) {
      const country_id = regions?.find((obj) => obj.label === inputs[5])?.id;
      country_id && getData(`application/getcountry/${country_id}`, {}, setCountry);
    }
  }

  useEffect(getQuestions, [getData, appId]);
  useEffect(getRegions, [getData]);
  useEffect(getCountry, [getData, inputs, regions]);
  // const { appId } = useParams();
  const [currentQue, setCurrentQue] = useState(0);
  // const [activeSection, setActiveSection] = useState(0);

  const handleScroll = useCallback((e) => {
    const { clientHeight, scrollTop } = e.target;
    console.log("SCROLLING...", { clientHeight, scrollTop });
    setCurrentQue(Math.round(scrollTop / clientHeight) + 1);
  }, [])

  const debouncedHandleScroll = debounce(handleScroll, 500);

  const handleNextPrevNav = (queNo, type) => {
    //   console.log('Questions = ',queNo);
    //   switch (type) {
    //     case 'next':
    //       setCurrentQue(queNo + 1);
    //       break;
    //     case 'prev':
    //       setCurrentQue(queNo - 1);
    //       break;
    //     case 'fixed':
    //       setCurrentQue(queNo);
    //       break;
    //     default:
    //       return;
    //   }
  }

  // useEffect(() => {
  //   // total height of scroll track
  //   // const trackHeight = containerRef.current.scrollHeight;
  //   //height of scroll
  //   const scrollBarHeight = containerRef.current.clientHeight;
  //   // top of the scroll from top of scroll track
  //   // const scrollTop = containerRef.current.scrollTop;

  //   containerRef.current.scrollTo(0, currentQue * scrollBarHeight);
  // }, [currentQue]);

  const handleFocusNext = (e) => {
    // debugger;
    if (e.which === 13) {
      const inputs = Array.from(containerRef.current.querySelectorAll('input'));
      const index = inputs.indexOf(e.target);
      inputs[index + 1]?.focus();
      // const index = inputs.(e.target)
      // console.log(containerRef.current);
    }
  }
  useEffect(() => {
    const inputs = Array.from(containerRef.current.querySelectorAll('input'));
    inputs[0]?.focus();
  }, [])

  const resetInputCountry = useCallback(() => {
    setInputs(prevInput => {
      const oldInput = { ...prevInput };
      [6, 8, 9, 10, 12, 13, 14].forEach(id => {
        delete oldInput[id];
      });
      return oldInput;
    })
  }, []);

  const handleAnswerChange = useCallback((name, value) => {
    if (value && value.length !== 0) {
      setInputs(prevState => {
        const oldInput = { ...prevState };
        // if (name === 5) {
        //   toBeDltQueId.forEach(id => {
        //     oldInput[id] && delete oldInput[id];
        //   })
        // };
        return { ...oldInput, [name]: value }
      });
    } else {
      setInputs(prevState => {
        const oldInput = { ...prevState };
        // if (name === 5) {
        //   toBeDltQueId.forEach(id => {
        //     oldInput[id] && delete oldInput[id];
        //   });
        // };
        delete oldInput[name];
        return oldInput;
      })
    }
  }, []);

  const handleImageInputChange = useCallback((name, value, type) => {
    
    if (value && value.length !== 0) {
      setImageInputs(prevState => {
        const oldInput = { ...prevState };
        // if (name === 5) {
        //   toBeDltQueId.forEach(id => {
        //     oldInput[id] && delete oldInput[id];
        //   })
        // };
        
        return { ...oldInput, [name]: value }
      });
    } else {
      
      setImageInputs(prevState => {
        const oldInput = { ...prevState };
        // if (name === 5) {
        //   toBeDltQueId.forEach(id => {
        //     oldInput[id] && delete oldInput[id];
        //   });
        // };
        delete oldInput[name];
        return oldInput;
      })
    }
  }, []);

  const handleRemoveFilesChange = useCallback((name, value)=> setRemoveFiles((prevState) => [...prevState, ...value]), [])

  const handleFilesChange = useCallback((name, value) => {
    setAllFiles((prevFiles) => {
      if (value && value.length !== 0) {
        const filtered_file = prevFiles.filter((file) =>{
          const found = value.find((value_file)=> value_file.name == file.name);
          if(found){
            return false
          }else{
            return true;
          }
        } );
        console.debug('value',value);
        console.debug('all pre files',prevFiles);
        return [...filtered_file, ...value];
      }
      else{
        return [...value];
      }
      
    })
  }, []);

  const handleRemoveFiles = useCallback((name, value) => {
    let remove_files_array = [];
    setAllFiles((prevFiles) => {
      if (value && value.length !== 0) {
        const filtered_file = prevFiles.filter((file) =>{
          console.debug('filtered_file', file);
          console.debug('value',value);
          const found = value.find((value_file)=> value_file == file.name);
          if(found){
            return false
          }else{
            return true;
          }
        } );
        // console.debug('all remove files',filtered_file);
        return filtered_file;
      }
    })
  }, []);

  const handleSubmit = () => {
    for (var key in inputs) {
      console.debug('key', key)
      if(key == 27 || key == 28){
        inputs[key].map((e, i) => {
        console.debug('que files', e['files'])
          console.log(imageInputs[`${key}`][`${i}`]?.['files'])
          if(imageInputs[`${key}`][`${i}`]?.['files'] !== undefined){
            e.files.push(...imageInputs[`${key}`][`${i}`]?.['files'])
          }
        })
      }
      if(key == 29){
        console.log('29',inputs[key])
        if(imageInputs[`${key}`].length > 0){
          inputs[key].files.push(...imageInputs[`${key}`]); 
        }
      }
    }
    // console.log({ inputs });
    if (!Boolean(inputs[3])) {
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: "Please Select Category" } });
      return;
    }
    if (!Boolean(inputs[6])) {
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: "Please Select Country" } });
      return;
    }
    const project_name = inputs[1]?.projectName ?? "Fragrance Brief";
    const final_inputs = {
      project_name: project_name,
      inputs: inputs
    };

    const formData = new FormData();
    for( const f in allFiles){
      formData.append('filename', allFiles[f]);
    }
      // files.forEach((elem) => {
      //   formData.append('filename', elem);
      // });
      formData.append('inputs', JSON.stringify(final_inputs));
      // formData.append('removeUploadedFiles', JSON.stringify(removeUploadedFiles));

    console.log(final_inputs);

    postData(`/application/submit?app_id=${appId ?? ""}`, formData, (data) => { navigate("/application/summary", { state: { app_id: data.app_id } }) });

  }

  function handleDraft() {

    for (var key in inputs) {
      if(key == 27 || key == 28){
        inputs[key].map((e, i) => {
          if(imageInputs[key][i]?.files) {
            e.files.push(...imageInputs[key][i].files)
          }
        })
      }
      if(key == 29){
        console.log('29',inputs[key])
        if(imageInputs[`${key}`]?.length > 0){
          inputs[key].files.push(...imageInputs[`${key}`]); 
        } 
      }
    }
    console.debug('drafting after inputs',inputs)
    if (!Boolean(inputs[3])) {
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: "Please Select Category" } });
      return;
    }
    const project_name = `Draft_${inputs[1]?.projectName ?? "Fragrance Brief"}`;
    const final_inputs = {
      project_name: project_name,
      inputs: inputs
    };

    console.log(final_inputs);
    console.log('divyaraj_files_1',allFiles);

    const formData = new FormData();
    for( const f in allFiles){
      formData.append('filename', allFiles[f]);
    }
      // files.forEach((elem) => {
      //   formData.append('filename', elem);
      // });
      formData.append('inputs', JSON.stringify(final_inputs));
      formData.append('removeFiles', JSON.stringify(removeFiles));
      // formData.append('removeUploadedFiles', JSON.stringify(removeUploadedFiles));

    console.log(final_inputs);

    postData(`/application/draft?app_id=${appId ?? ""}`, formData, (data) => { navigate(`/application/drafted`, { state: { app_id: data.app_id } }) });
  }

  console.debug("QUESTIONS: ", catWiseQues);
  let count = 1;
  return (
    <ApplicationContext.Provider value={{ catWiseQues, inputs, currentQue, handleNextPrevNav, handleAnswerChange, handleFilesChange, handleRemoveFilesChange, handleRemoveFiles, handleImageInputChange, regions, country, resetInputCountry }}>
      <main className="appFormContainer">
        <ErrorBoundary>
          <NavSideBar formRef={containerRef} activeQue={currentQue} appId={appId} />
        </ErrorBoundary>

        <div className="formRelative">
          <ErrorBoundary>
            <section id="form" ref={containerRef} onScroll={debouncedHandleScroll}>
            {/* <section id="form" ref={containerRef} > */}
              {catWiseQues.map((cat, catIndex) => (
                <Fragment key={cat.category_id}>

                  {cat.category_id !== 1 && (<div className="pageWrapper" id={count}>
                    <div className="pageContainer">
                      <WelcomeScreen categoryId={cat.category_id} nav={count++} categoryName={cat.category_name} />
                      <div className="unilever-icon questionPage">
                        <UnileverIcon width="64px" />
                      </div>
                    </div>
                  </div>)}

                  {cat.questions.map((que, questionIndex) => (
                    <div className="pageWrapper" key={que.id} data-que-type={que.question_type_id} data-que-id={que.id} id={count}>
                      <div className="pageContainer">
                        <QuestionType question={que} nav={count++} index={questionIndex} inputs={inputs} onKeyUp={handleFocusNext} />
                          <Link to='/dashboard'>
                        <div className="unilever-icon questionPage">
                          <UnileverIcon width="64px"/>
                        </div>
                          </Link>
                        <div className="assets bg_images">
                          {que.imgData?.map((e) => (
                            <img key={e.path} src={`/images/${e.path}`} style={{ position: 'absolute', right: 0, bottom: 0, ...e.style }} alt={e.path} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                </Fragment>
              )
              )}

            </section>
          </ErrorBoundary>

          <div className='actionBtnCont'>
            <Button variant="outlined" color="secondary" onClick={handleDraft}>Save as Draft</Button>
            <Button variant="outlined" color="secondary" onClick={handleSubmit}>Submit</Button>
          </div>
        </div>


      </main>
    </ApplicationContext.Provider>
  )
}

function getCatWiseQues(questions) {
  const result = [];
  let count = 1;
  questions.forEach((que, index) => {
    const imgData = img_data[que.id];
    if (result[que.category.id - 1]) {
      result[que.category.id - 1].questions = [...result[que.category.id - 1].questions, { ...que, imgData: imgData, serial: count++ }];
    } else {
      result[que.category.id - 1] = { category_id: que.category.id, category_name: que.category.name, questions: [{ ...que, imgData: imgData, serial: count++ }] }
    }
  });
  // console.log("Sidebar_CatWiseData: ", result);
  return result;
}

const img_data = {
  1: [
    { path: "question_1_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_1_small.svg", style: { bottom: '15vw', right: '3vw', width: '7vw' } },
  ],
  2: [
    { path: "question_2_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_2_small.svg", style: { bottom: '13vw', right: '8vw', width: '6vw' } },
  ],
  3: [
    { path: "question_3_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_3_small.svg", style: { bottom: '3vw', right: '15vw', width: '7vw' } },
  ],
  4: [
    { path: "question_4_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_4_small.svg", style: { bottom: '13vw', right: '7vw', width: '7vw' } },
  ],
  5: [
    { path: "question_5_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_5_small.svg", style: { bottom: '13vw', right: '2vw', width: '7vw' } },
  ],
  6: [
    { path: "question_6_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_6_small.svg", style: { bottom: '2vw', right: '17vw', width: '7vw' } },
  ],
  // 7: [
  //   { path: "question_7_main.png", style: {right: 0, width: '15vw'}},
  //   { path: "question_7_small.svg", style: {bottom: '15vw', right: '3vw', width: '7vw'}},
  // ],
  // 8: [
  //   { path: "question_8_main.png", style: {right: 0, width: '15vw'}},
  //   { path: "question_8_small.svg", style: {bottom: '15vw', right: '3vw', width: '7vw'}},
  // ],
  // 9: [
  //   { path: "question_9_main.png", style: {right: 0, width: '15vw'}},
  //   { path: "question_9_small.svg", style: {bottom: '15vw', right: '3vw', width: '7vw'}},
  // ],
  10: [
    { path: "question_7_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_7_small.svg", style: { bottom: '3vw', right: '18vw', width: '7vw' } },
  ],
  // 11: [
  //   { path: "question_3_main.png", style: {right: 0, width: '15vw'}},
  //   { path: "question_3_small.svg", style: {bottom: '15vw', right: '3vw', width: '7vw'}},
  // ],
  // 12: [
  //   { path: "question_4_main.png", style: {right: 0, width: '15vw'}},
  //   { path: "question_4_small.svg", style: {bottom: '15vw', right: '3vw', width: '7vw'}},
  // ],
  // 13: [
  //   { path: "question_5_main.png", style: {right: 0, width: '15vw'}},
  //   { path: "question_5_small.svg", style: {bottom: '15vw', right: '3vw', width: '7vw'}},
  // ],
  14: [
    { path: "question_8_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_8_small.svg", style: { bottom: '3vw', right: '17vw', width: '7vw' } },
  ],
  15: [
    { path: "question_9_main.png", style: { right: 0, width: '13vw' } },
    { path: "question_9_small.svg", style: { bottom: '11vw', right: '13vw', width: '6vw' } },
  ],
  16: [
    { path: "question_1_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_1_small.svg", style: { bottom: '8vw', right: '16vw', width: '7vw' } },
  ],
  17: [
    { path: "question_2_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_2_small.svg", style: { bottom: '3vw', right: '14vw', width: '6vw' } },
  ],
  18: [
    { path: "question_3_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_3_small.svg", style: { bottom: '8vw', right: '13vw', width: '7vw' } },
  ],
  19: [
    { path: "question_4_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_4_small.svg", style: { bottom: '12vw', right: '10vw', width: '7vw' } },
  ],
  20: [
    { path: "question_5_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_5_small.svg", style: { bottom: '2vw', right: '14vw', width: '7vw' } },
  ],
  21: [
    { path: "question_6_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_6_small.svg", style: { bottom: '2vw', right: '17vw', width: '7vw' } },
  ],
  22: [
    { path: "question_1_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_1_small.svg", style: { bottom: '5vw', right: '16vw', width: '7vw' } },
  ],
  23: [
    { path: "question_2_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_2_small.svg", style: { bottom: '10vw', right: '12vw', width: '6vw' } },
  ],
  24: [
    { path: "question_3_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_3_small.svg", style: { bottom: '3vw', right: '14vw', width: '7vw' } },
  ],
  25: [
    { path: "question_4_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_4_small.svg", style: { bottom: '6vw', right: '15vw', width: '7vw' } },
  ],
  29: [
    { path: "question_5_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_5_small.svg", style: { bottom: '3vw', right: '13vw', width: '7vw' } },
  ],
  30: [
    { path: "question_6_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_6_small.svg", style: { bottom: '2vw', right: '17vw', width: '7vw' } },
  ]
};