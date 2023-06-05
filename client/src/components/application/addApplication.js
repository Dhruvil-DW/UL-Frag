import { Button } from "@mui/material";
import { Fragment, createContext, useCallback, useEffect, useRef, useState } from "react";
import QuestionType from "./questionTypes";
import NavSideBar from "./navSideBar";
import debounce from "../../utils/globalFunctions/debounce";
// import { useParams } from "react-router";
import UnileverIcon from "../../assets/icons/unileverIcon";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../../config/errorBoundary/ErrorBoundary";
import WelcomeScreen from "./welcomeScreen/welcomeScreen";
import { useAxios } from "../../hooks/useAxios";
export const ApplicationContext = createContext();

export default function AddApplication() {
  const navigate = useNavigate();
  const [catWiseQues, setCatWiseQues] = useState([]);
  const [inputs, setInputs] = useState({});
  const containerRef = useRef(null);
  const { getData, postData } = useAxios();

  function getQuestions() {
    getData(`/application/questions/getall`, {}, (data) => {
      const newData = getCatWiseQues(data);
      setCatWiseQues(newData);
    });
  }

  useEffect(getQuestions, [getData]);
  // const { appId } = useParams();
  const [currentQue, setCurrentQue] = useState(0);
  // const [activeSection, setActiveSection] = useState(0);

  const handleScroll = useCallback((e) => {
    const { clientHeight, scrollTop } = e.target;
    console.log("SCROLLING...", { clientHeight, scrollTop });
    setCurrentQue(Math.round(scrollTop / clientHeight));
  }, [])

  const debouncedHandleScroll = debounce(handleScroll, 500);

  const handleNextPrevNav = (queNo, type) => {
    console.log(queNo);
    switch (type) {
      case 'next':
        setCurrentQue(queNo + 1);
        break;
      case 'prev':
        setCurrentQue(queNo - 1);
        break;
      case 'fixed':
        setCurrentQue(queNo);
        break;
      default:
        return;
    }
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

  const handleAnswerChange = useCallback((name, value) => {
    if (value && value.length !== 0) {
      setInputs(prevState => ({ ...prevState, [name]: value }));
    } else {
      setInputs(prevState => {
        const oldInput = { ...prevState };
        delete oldInput[name];
        return oldInput;
      })
    }
  }, []);

  const handleSubmit = () => {
    console.log({ inputs });
    const project_name = inputs[1]?.projectName ?? "Fragrance Brief";
    const final_inputs = {
      project_name: project_name,
      inputs: inputs
    };

    console.log(final_inputs);

    postData(`/user/submit`, final_inputs, (data) => { navigate("/application/summary", { state: { app_id: data.app_id } }) });

    //API CALLS
    //Temp Save to Local
    // const submitApp = JSON.parse(localStorage.getItem("submitApp")); //Get App from Local
    // console.log({ submitApp });
    // let newSubmitApp;
    // const dateTime = new Date();
    // const dateStr = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`
    // const randomNum = Math.floor(1000 + Math.random() * 9000);
    // if (submitApp) {
    //   newSubmitApp = [{ app_id: `app-${randomNum}`, title: `${inputs[1]?.projectName ?? "Fragrance Brief"} ${randomNum}`, name: 'Andrew smith', modifiedDate: dateStr, inputs: inputs }, ...submitApp];
    // } else {
    //   newSubmitApp = [{ app_id: `app-${randomNum}`, title: `${inputs[1]?.projectName ?? "Fragrance Brief"} ${randomNum}`, name: 'Andrew smith', modifiedDate: dateStr, inputs: inputs }];
    // }

    // localStorage.setItem("submitApp", JSON.stringify(newSubmitApp)); //Set New App to Local
    // navigate("/application/summary", { state: { app_id: `app-${randomNum}` } });
  }

  console.log("QUESTIONS: ", catWiseQues);
  return (
    <ApplicationContext.Provider value={{ catWiseQues, inputs, currentQue, handleNextPrevNav, handleAnswerChange }}>
      <main className="appFormContainer">
        <ErrorBoundary>
          <NavSideBar formRef={containerRef} activeQue={currentQue} />
        </ErrorBoundary>

        <div className="formRelative">
          <ErrorBoundary>
            <section id="form" ref={containerRef} onScroll={debouncedHandleScroll}>
              {catWiseQues.map((cat, catIndex) => (
                <Fragment key={cat.category_id}>

                  {cat.category_id !== 1 && (<div className="pageWrapper">
                    <div className="pageContainer">
                      <WelcomeScreen categoryId={cat.category_id} categoryName={cat.category_name} />
                      <div className="unilever-icon questionPage">
                        <UnileverIcon width="64px" />
                      </div>
                    </div>
                  </div>)}

                  {cat.questions.map((que, questionIndex) => (
                    <div className="pageWrapper" key={que.id} id={que.id}>
                      <div className="pageContainer">
                        <QuestionType question={que} index={questionIndex} inputs={inputs} onChange={handleAnswerChange} onKeyUp={handleFocusNext} />
                        <div className="unilever-icon questionPage">
                          <UnileverIcon width="64px" />
                        </div>
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
            <Button variant="outlined" color="secondary">Save as Draft</Button>
            <Button variant="outlined" color="secondary" onClick={handleSubmit}>Submit</Button>
          </div>
        </div>


      </main>
    </ApplicationContext.Provider>
  )
}

function getCatWiseQues(questions) {
  const result = [];
  questions.forEach((que, index) => {
    const imgData = img_data[que.id];
    if (result[que.category.id - 1]) {
      result[que.category.id - 1].questions = [...result[que.category.id - 1].questions, { ...que, imgData: imgData }];
    } else {
      result[que.category.id - 1] = { category_id: que.category.id, category_name: que.category.name, questions: [{ ...que, imgData: imgData }] }
    }
  });
  // console.log("Sidebar_CatWiseData: ", result);
  return result;
}

const img_data = {
  1: [
    { path: "question_1_main.png", style: { right: 0, width: '15vw'}},
    { path: "question_1_small.svg", style: { bottom: '15vw', right: '3vw', width: '7vw' }},
  ],
  2: [
    { path: "question_2_main.png", style: {right: 0, width: '12vw'}},
    { path: "question_2_small.svg", style: {bottom: '13vw', right: '8vw', width: '6vw'}},
  ],
  3: [
    { path: "question_3_main.png", style: {right: 0, width: '12vw'}},
    { path: "question_3_small.svg", style: {bottom: '3vw', right: '15vw', width: '7vw'}},
  ],
  4: [
    { path: "question_4_main.png", style: {right: 0, width: '12vw'}},
    { path: "question_4_small.svg", style: {bottom: '13vw', right: '7vw', width: '7vw'}},
  ],
  5: [
    { path: "question_5_main.png", style: {right: 0, width: '12vw'}},
    { path: "question_5_small.svg", style: {bottom: '13vw', right: '2vw', width: '7vw'}},
  ],
  6: [
    { path: "question_6_main.png", style: {right: 0, width: '15vw'}},
    { path: "question_6_small.svg", style: {bottom: '2vw', right: '17vw', width: '7vw'}},
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
    { path: "question_7_main.png", style: {right: 0, width: '15vw'}},
    { path: "question_7_small.svg", style: {bottom: '3vw', right: '18vw', width: '7vw'}},
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
    { path: "question_8_main.png", style: {right: 0, width: '15vw'}},
    { path: "question_8_small.svg", style: {bottom: '3vw', right: '17vw', width: '7vw'}},
  ],
  15: [
    { path: "question_9_main.png", style: {right: 0, width: '13vw'}},
    { path: "question_9_small.svg", style: {bottom: '11vw', right: '13vw', width: '6vw'}},
  ],
  16: [
    { path: "question_1_main.png", style: { right: 0, width: '15vw'}},
    { path: "question_1_small.svg", style: { bottom: '8vw', right: '16vw', width: '7vw' }},
  ],
  17: [
    { path: "question_2_main.png", style: {right: 0, width: '12vw'}},
    { path: "question_2_small.svg", style: {bottom: '3vw', right: '14vw', width: '6vw'}},
  ],
  18: [
    { path: "question_3_main.png", style: {right: 0, width: '12vw'}},
    { path: "question_3_small.svg", style: {bottom: '8vw', right: '13vw', width: '7vw'}},
  ],
  19: [
    { path: "question_4_main.png", style: {right: 0, width: '12vw'}},
    { path: "question_4_small.svg", style: {bottom: '12vw', right: '10vw', width: '7vw'}},
  ],
  20: [
    { path: "question_5_main.png", style: {right: 0, width: '12vw'}},
    { path: "question_5_small.svg", style: {bottom: '2vw', right: '14vw', width: '7vw'}},
  ],
  21: [
    { path: "question_6_main.png", style: {right: 0, width: '15vw'}},
    { path: "question_6_small.svg", style: {bottom: '2vw', right: '17vw', width: '7vw'}},
  ],
  22: [
    { path: "question_1_main.png", style: { right: 0, width: '15vw'}},
    { path: "question_1_small.svg", style: { bottom: '5vw', right: '16vw', width: '7vw' }},
  ],
  23: [
    { path: "question_2_main.png", style: {right: 0, width: '12vw'}},
    { path: "question_2_small.svg", style: {bottom: '10vw', right: '12vw', width: '6vw'}},
  ],
  24: [
    { path: "question_3_main.png", style: {right: 0, width: '12vw'}},
    { path: "question_3_small.svg", style: {bottom: '3vw', right: '14vw', width: '7vw'}},
  ],
  25: [
    { path: "question_4_main.png", style: {right: 0, width: '12vw'}},
    { path: "question_4_small.svg", style: {bottom: '6vw', right: '15vw', width: '7vw'}},
  ],
  29: [
    { path: "question_5_main.png", style: {right: 0, width: '12vw'}},
    { path: "question_5_small.svg", style: {bottom: '3vw', right: '13vw', width: '7vw'}},
  ],
  30: [
    { path: "question_6_main.png", style: {right: 0, width: '15vw'}},
    { path: "question_6_small.svg", style: {bottom: '2vw', right: '17vw', width: '7vw'}},
  ]
};