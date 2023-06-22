import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ApplicationContext } from "../addApplication";
import ArrowLeftRoundIcon from "../../../assets/icons/arrowLeftRoundIcon";
import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";

export default function RadioImage({ question, nav, index, value = {}, onKeyUp }) {
  const { handleAnswerChange, inputs } = useContext(ApplicationContext);
  //console.log("INPUTSCONTEXT-", inputs);
  const [input, setInput] = useState(value);
  const [brands, setBrands] = useState(question.question_opt);
  const defferedInput = useDeferredValue(input);
  // console.log(question);

  useEffect(() => {
    if (defferedInput.brand || defferedInput.desc) {
      handleAnswerChange(question.id, defferedInput);
    } else if (!defferedInput.brand && !defferedInput.desc) {
      handleAnswerChange(question.id, null);
    }
  }, [defferedInput, handleAnswerChange, question.id])

  useEffect(() => {
    switch(inputs[3]){
      case "Fabric clean(FCL)":
        return setBrands([
          'brand_sunlight.png', 
          'brand_dirtisgood_new.png', 
          'brand_brilhante.png', 
          'brand_skip.png', 
          'brand_wheel.png', 
          'brand_surf.png',
          'brand_robjin.png',
        ]);
      case "Fabric Enhancer(FEN)":
        return setBrands(['brand_comfort.png', 'brand_snuggle.png']);
      case "Home & Hygiene(H&H)":
        return setBrands(['brand_cif_new.png', 'brand_dirtisgood_new.png', 'brand_sunlight.png', 'brand_sun.png', 'brand_domestos_new.png',]);
      case "Other":
        default:
        return setBrands(question.question_opt);
    }
    
  },[inputs[3]])
  function BasicExample(nav) {
    const element = document.getElementById(nav);
    console.log('new nav', nav);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  return (
    <div className="questionContainer">
      <h2 className="question">{question.question}</h2>

      <div style={{ display: "flex", gap: "1rem" }}>

        <RadioGroup value={input.brand ?? ""} onChange={(e, value) => setInput((prevInput) => ({ ...prevInput, brand: value }))} style={{ flexGrow: 0 }}>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {brands?.map((path) => (
              <FormControlLabel key={path} label={<BrandImage path={path} />} value={path} control={<Radio style={{ alignSelf: "flex-start" }} />} />
            ))}
          </div>
        </RadioGroup>

        <div style={{ flexGrow: 1, flexShrink: 0, height: 250, flexBasis: 250, backgroundColor: "rgb(201 177 255)", padding: 16 }}>
          <h3 style={{ color: "white", fontSize: 18 }}>Global Brand Position</h3>
          <TextField multiline rows={6} fullWidth inputProps={{ maxLength: 1000 }} placeholder="Enter your description here" sx={{ '& .MuiInputBase-multiline': { borderRadius: 0, padding: 0 } }} value={input.desc} onChange={(e) => setInput((prevInput) => ({ ...prevInput, desc: e.target.value }))} />
          <div style={{ position: "absolute", bottom: 56, right: 24, color: "hsl(0, 0%, 90%)" }}>{`${input.desc?.length ?? 0} / 1000`}</div>
        </div>
      </div>

      <div className='navBtnCont'>
        <div className="prevBtn" tabIndex={-1} onClick={() => BasicExample((nav) - 1)}><ArrowLeftRoundIcon /></div>
        <div className="nextBtn" tabIndex={-1} onClick={() => BasicExample((nav) + 1)}><ArrowLeftRoundIcon /></div>
      </div>
    </div>
  )
}

function BrandImage({ path }) {
  return (
    <div style={{ height: 80, display: "flex", alignItems: "flex-end" }}>
      <img src={`/images/${path}`} alt="BrandImage" height={33}/>
    </div>
  )
}