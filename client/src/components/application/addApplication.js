import { Button } from "@mui/material";
import { questionsData } from "../../utils/globalData/questionData";
import { useRef, useState } from "react";
import QuestionType from "./questionTypes";
import ArrowLeftRoundIcon from "../../assets/icons/arrowLeftRoundIcon";
import NavSideBar from "./navSideBar";
import debounce from "../../utils/globalFunctions/debounce";

export default function AddApplication() {
  const [questions] = useState(questionsData);
  const [inputs, setInputs] = useState({});
  const containerRef = useRef(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  
  const handleScroll = (e) => {
    console.log("SCROLLING...");
    setScrollHeight(e.target.clientHeight);
    setScrollTop(e.target.scrollTop);
  }
  const debouncedHandleScroll = debounce(handleScroll);

  const handleJump = (type, num) => {
    console.log("SCROLLING...");
    console.log(containerRef);
    // total height of scroll track
    // const trackHeight = containerRef.current.scrollHeight;
    //height of scroll
    const scrollBarHeight = containerRef.current.clientHeight;
    // top of the scroll from top of scroll track
    const scrollTop = containerRef.current.scrollTop;
    switch (type) {
      case 'next':
        console.log("HANDLE_JUMP: ", { type, scrollTop });
        containerRef.current.scrollTo(0, scrollTop + scrollBarHeight);
        break;
      case 'prev':
        console.log("HANDLE_JUMP: ", { type, scrollTop });
        containerRef.current.scrollTo(0, scrollTop - scrollBarHeight);
        break;
      case 'fixed':
        console.log("HANDLE_JUMP: ", { type, num, scrollBarHeight, ans: num * scrollBarHeight });
        containerRef.current.scrollTo(0, num * scrollBarHeight);
        break;
      default:
        return;
    }
  }

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

  const handleInputChange = (name, value) => {
    setInputs(prevState => ({ ...prevState, [name]: value }));
  }

  return (
    <main className="appFormContainer">
    
      <NavSideBar questionData={questionsData} inputs={inputs} handleJump={handleJump} scrollData={{ scrollHeight, scrollTop }} />

      <section id="form" ref={containerRef} onScroll={debouncedHandleScroll}>
      {questions.map(que => (
          <div className="pageWrapper" key={que.id}>
            <div className="pageContainer">
              <QuestionType question={que} inputs={inputs} onChange={handleInputChange} onKeyUp={handleFocusNext} />
            </div>
          </div>
        )
      )}
      </section>
      
      <div className='navBtnCont'>
        <button className="nextBtn" onClick={() => handleJump('prev')}><ArrowLeftRoundIcon /></button>
        <button className="prevBtn" onClick={() => handleJump('next')}><ArrowLeftRoundIcon style={{transform: "rotate(0.5turn)"}} /></button>
        <Button>Submit</Button>
      </div>

    </main>
  )
}