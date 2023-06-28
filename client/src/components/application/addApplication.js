import { Button, CircularProgress, Dialog } from "@mui/material";
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
import { useGetAnswer, useGetCountry, useGetQuestions, useGetRegion } from "./addAppAPIs";
export const ApplicationContext = createContext();

export default function AddApplication() {
  const { appId } = useParams();
  const { promptDispatch } = useContext(promptContext);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [imageInputs, setImageInputs] = useState({});
  const [allFiles, setAllFiles] = useState([]);
  const [removeFiles, setRemoveFiles] = useState([]);
  const containerRef = useRef(null);
  const { postData } = useAxios();

  // console.log("INPUTS: ", inputs);

  const regionList = useGetRegion();
  const countryList = useGetCountry(regionList?.data?.find((obj) => obj.label === inputs[5])?.id);
  const catQue = useGetQuestions();
  const answers = useGetAnswer(appId);
  const catWiseQues = catQue?.data ?? [];

  function getAnswers() {
    console.log("GET_ANSWERS: ");
    if (answers?.data?.inputs) {
      console.log("SET_INPUTS: ", answers.data.inputs);
      setInputs(answers.data.inputs);
    }
  }
  useEffect(getAnswers, [answers.status, answers.data, appId]);
  // useEffect(getRegions, [getData]);
  // useEffect(getCountry, [getData, inputs, regions]);
  // const { appId } = useParams();
  const [currentQue, setCurrentQue] = useState(1);
  // const [activeSection, setActiveSection] = useState(0);

  const handleScroll = useCallback((e) => {
    const { clientHeight, scrollTop } = e.target;
    // console.log("SCROLLING...", { clientHeight, scrollTop });
    setCurrentQue(Math.round(scrollTop / clientHeight) + 1);
  }, [])

  const debouncedHandleScroll = debounce(handleScroll, 500);

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
  // useEffect(() => {
  //   const inputs = Array.from(containerRef.current.querySelectorAll('input'));
  //   inputs[0]?.focus();
  // }, [])

  const resetInputCountry = useCallback(() => {
    setInputs(prevInput => {
      const oldInput = { ...prevInput };
      [6, 8, 9, 10, 12, 13, 14].forEach(id => {
        delete oldInput[id];
      });
      return oldInput;
    })
  }, []);
  const resetMarket = useCallback(() => {
    setInputs(prevInput => {
      const oldInput = { ...prevInput };
      [8, 9, 10, 12, 13, 14].forEach(id => {
        delete oldInput[id];
      });
      return oldInput;
    })
  }, []);

  const handleAnswerChange = useCallback((name, value) => {
    if (value && value.length !== 0) {
      setInputs(prevState => {
        const oldInput = { ...prevState };
        return { ...oldInput, [name]: value }
      });
    } else {
      setInputs(prevState => {
        const oldInput = { ...prevState };
        delete oldInput[name];
        return oldInput;
      })
    }
  }, []);

  const handleImageInputChange = useCallback((name, value, type) => {

    if (value && value.length !== 0) {
      setImageInputs(prevState => {
        const oldInput = { ...prevState };
        return { ...oldInput, [name]: value }
      });
    } else {

      setImageInputs(prevState => {
        const oldInput = { ...prevState };
        delete oldInput[name];
        return oldInput;
      })
    }
  }, []);

  const handleRemoveFilesChange = useCallback((name, value) => setRemoveFiles((prevState) => [...prevState, ...value]), [])

  const handleFilesChange = useCallback((name, value) => {
    setAllFiles((prevFiles) => {
      if (value && value.length !== 0) {
        const filtered_file = prevFiles.filter((file) => {
          const found = value.find((value_file) => value_file.name == file.name);
          if (found) {
            return false
          } else {
            return true;
          }
        });
        return [...filtered_file, ...value];
      }
      else {
        return [...value];
      }

    })
  }, []);

  const handleRemoveFiles = useCallback((name, value) => {
    setAllFiles((prevState) => prevState.filter((file) => file !== value));
  }, []);

  const handleSubmit = () => {
    // console.log({ inputs });
    if (!(inputs[1]?.option && inputs[1]?.projectName)) {
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: "Please enter project name" } });
      return;
    }

    if (!Boolean(inputs[3])) {
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: "Please Select Category" } });
      return;
    }
    if (!Boolean(inputs[6])) {
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: "Please Select Country" } });
      return;
    }
    if (!Boolean(inputs[20])) {
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: "Please confirm question number 2.4" } });
      return;
    }

    for (var key in inputs) {
      console.debug('key', key)
      if (key == 27 || key == 28) {
        inputs[key].map((e, i) => {
          console.debug('que files', e['files'])
          console.log(imageInputs[`${key}`][`${i}`]?.['files'])
          if (imageInputs[`${key}`][`${i}`]?.['files'] !== undefined) {
            e.files.push(...imageInputs[`${key}`][`${i}`]?.['files'])
          }
        })
      }
      if (key == 29) {
        console.log('29', inputs[key])
        if (imageInputs[`${key}`]?.length > 0) {
          inputs[key].files.push(...imageInputs[`${key}`]);
        }
      }
    }
    if (!Boolean(inputs[20])) {
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: "Please Confirm before proceeding" } });
      return;
    }
    const project_name = inputs[1]?.projectName ?? "Fragrance Brief";
    const final_inputs = {
      project_name: project_name,
      inputs: inputs
    };

    const formData = new FormData();
    for (const f in allFiles) {
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
    if (!(inputs[1]?.option && inputs[1]?.projectName)) {
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: "Please enter project name" } });
      return;
    }
    if (!Boolean(inputs[3])) {
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: "Please Select Category" } });
      return;
    }
    // if (!Boolean(inputs[6])) {
    //   promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: "Please Select Country" } });
    //   return;
    // }
    // if (!Boolean(inputs[20])) {
    //   promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: "Please confirm question number 2.4" } });
    //   return;
    // }

    for (var key in inputs) {
      if (key == 27 || key == 28) {
        inputs[key].map((e, i) => {
          if (imageInputs[key][i]?.files) {
            e.files.push(...imageInputs[key][i].files)
          }
        })
      }
      if (key == 29) {
        console.log('29', inputs[key])
        if (imageInputs[`${key}`]?.length > 0) {
          inputs[key].files.push(...imageInputs[`${key}`]);
        }
      }
    }
    console.debug('drafting after inputs', inputs)
    const project_name = `${inputs[1]?.projectName ?? "Fragrance Brief"}`;
    const final_inputs = {
      project_name: project_name,
      inputs: inputs
    };

    const formData = new FormData();
    for (const f in allFiles) {
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

  // console.debug("QUESTIONS: ", catWiseQues);
  // let count = 1;
  // if (true) return (<LoadingAddApp />)
  if (catQue.status === "loading" || (appId && !(Object.keys(inputs).length))) return (<LoadingAddApp />)
  return (
    <ApplicationContext.Provider value={{ catWiseQues, inputs, currentQue, handleAnswerChange, handleFilesChange, handleRemoveFilesChange, handleRemoveFiles, handleImageInputChange, regions: regionList.data, country: countryList.data, resetInputCountry, resetMarket }}>
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

                  {cat.category_id !== 1 && (<div className="pageWrapper" id={cat.serial}>
                    <div className="pageContainer">
                      <WelcomeScreen categoryId={cat.category_id} nav={cat.serial} categoryName={cat.category_name} />
                      <div className="unilever-icon questionPage">
                        <UnileverIcon width="64px" />
                      </div>
                    </div>
                  </div>)}

                  {cat.questions.map((que, questionIndex) => (
                    <div className="pageWrapper" key={que.id} data-que-type={que.question_type_id} data-que-id={que.id} id={que.serial}>
                      <div className="pageContainer">
                        <div className="categoryText">{`${que?.category?.id}. ${que?.category?.name ?? ""}`}</div>
                        <QuestionType question={que} nav={que.serial} index={questionIndex} onKeyUp={handleFocusNext} />
                        <Link to='/dashboard' tabIndex={-1}>
                          <div className="unilever-icon questionPage">
                            <UnileverIcon width="64px" />
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

function LoadingAddApp() {
  return (
    // <Dialog open PaperProps={{ sx: { bgcolor: "transparent", boxShadow: 'none' } }} >
    //   <div style={{ height: 200, width: 200, color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
    //     <CircularProgress color="inherit" />
    //   </div>
    // </Dialog>
    <main className="appFormContainer">
      <aside className="sidebar"></aside>
      <div className="formRelative" style={{ color: "black", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress color="inherit" />
      </div>
    </main>
  )
}