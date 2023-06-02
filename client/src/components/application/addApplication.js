import { Button } from "@mui/material";
import { questionsData } from "../../utils/globalData/questionData";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import QuestionType from "./questionTypes";
import NavSideBar from "./navSideBar";
import debounce from "../../utils/globalFunctions/debounce";
// import { useParams } from "react-router";
import UnileverIcon from "../../assets/icons/unileverIcon";
import { useNavigate } from "react-router-dom";
export const ApplicationContext = createContext();

export default function AddApplication() {
  const navigate = useNavigate();
  const [questions] = useState(questionsData);
  const [inputs, setInputs] = useState({});
  const containerRef = useRef(null);

  // const { appId } = useParams();
  const [currentQue, setCurrentQue] = useState(0);

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
      newSubmitApp = [...submitApp, { app_id: `app-${randomNum}`, title: `Fragrance Brief ${randomNum}`, name: 'Andrew smith', modifiedDate: dateStr, inputs: inputs }];
    } else {
      newSubmitApp = [{ app_id: `app-${randomNum}`, title: `Fragrance Brief ${randomNum}`, name: 'Andrew smith', modifiedDate: dateStr, inputs: inputs }];
    }

    localStorage.setItem("submitApp", JSON.stringify(newSubmitApp)); //Set New App to Local
    navigate("/application/summary");
  }

  return (
    <ApplicationContext.Provider value={{ questions, inputs, currentQue, handleNextPrevNav, handleAnswerChange }}>
      <main className="appFormContainer">

        <NavSideBar questionData={questionsData} inputs={inputs} formRef={containerRef} activeQue={currentQue} />
        <div className="formRelative">
          <section id="form" ref={containerRef} onScroll={debouncedHandleScroll}>
            {questions.map((que, index) => (
              <div className="pageWrapper" key={que.id}>
                <div className="pageContainer">
                  <QuestionType question={que} index={index} inputs={inputs} onChange={handleAnswerChange} onKeyUp={handleFocusNext} />
                  <div className="unilever-icon questionPage">
                    <UnileverIcon width="64px" />
                  </div>
                </div>
              </div>
            )
            )}

          </section>

          <div className='actionBtnCont'>
            <Button variant="outlined" color="secondary">Save as Draft</Button>
            <Button variant="outlined" color="secondary" onClick={handleSubmit}>Submit</Button>
          </div>
        </div>


      </main>
    </ApplicationContext.Provider>
  )
}