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
  const { getData } = useAxios();

  function getQuestions() {
    getData(`/application/questions/getall`, {}, (data) => {
      const newData = getCatWiseQues(data);
      setCatWiseQues(newData);
    });
  }

  useEffect(getQuestions, [getData]);
  // const { appId } = useParams();
  const [currentQue, setCurrentQue] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

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

  useEffect(() => {
    // total height of scroll track
    // const trackHeight = containerRef.current.scrollHeight;
    //height of scroll
    const scrollBarHeight = containerRef.current.clientHeight;
    // top of the scroll from top of scroll track
    // const scrollTop = containerRef.current.scrollTop;

    containerRef.current.scrollTo(0, currentQue * scrollBarHeight);
  }, [currentQue]);

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

    //API CALLS
    //Temp Save to Local
    const submitApp = JSON.parse(localStorage.getItem("submitApp")); //Get App from Local
    console.log({ submitApp });
    let newSubmitApp;
    const dateTime = new Date();
    const dateStr = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    if (submitApp) {
      newSubmitApp = [{ app_id: `app-${randomNum}`, title: `${inputs[1]?.projectName ?? "Fragrance Brief"} ${randomNum}`, name: 'Andrew smith', modifiedDate: dateStr, inputs: inputs }, ...submitApp];
    } else {
      newSubmitApp = [{ app_id: `app-${randomNum}`, title: `${inputs[1]?.projectName ?? "Fragrance Brief"} ${randomNum}`, name: 'Andrew smith', modifiedDate: dateStr, inputs: inputs }];
    }

    localStorage.setItem("submitApp", JSON.stringify(newSubmitApp)); //Set New App to Local
    navigate("/application/summary", { state: { app_id: `app-${randomNum}` } });
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
    if (result[que.category.id - 1]) {
      result[que.category.id - 1].questions = [...result[que.category.id - 1].questions, que];
    } else {
      result[que.category.id - 1] = { category_id: que.category.id, category_name: que.category.name, questions: [que] }
    }
  });
  // console.log("Sidebar_CatWiseData: ", result);
  return result;
}