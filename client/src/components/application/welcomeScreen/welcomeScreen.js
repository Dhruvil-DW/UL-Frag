import { Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";

const getData = {

  'About the Fragrance': {
    Title: "Tell us more about the fragrances you want to create",
    style: {background:"#FFBCD8"}, 
    ImgData: [
      {link:"s1_i1.png", style: { width : '35vw',position: 'absolute',right:'6vw',bottom:'1vw','zIndex':'1'}},
      {link:"s1_i2.png", style: {width : '14vw',position: 'absolute',right:'26vw',bottom:'17vw'}},
      {link:"s1_i3.png", style: {width : '18vw',position: 'absolute',right:'20vw',top:'1vw'}},
      {link:"s1_i4.png", style: {width : '10vw',position: 'absolute',right:'7vw',bottom:'25vw'}},
      {link:"s1_i5.png", style: {width : '5vw',position: 'absolute',right:'32vw',bottom:'13vw','zIndex':'0'}},
      {link:"s1_i6.png", style: {width : '3vw',position: 'absolute',right:'21vw',bottom:'26vw'}},
      {link:"s1_i7.png", style: {width : '5vw',position: 'absolute',right:'10vw',top:'0vw'}},
      {link:"s1_i8.png", style: {width : '5vw',position: 'absolute',right:'5vw',bottom:'22vw'}},
    ],
    linkPrevious : "/application/new#15",
    linkNext : "/application/new#16",
  },
  'About the Consumers': {
    Title: "Tell us more about consumers",
    style: {background:"#F8E075"}, 
    ImgData: [
      {link:"s2_i1.png", style: { width : '30vw',position: 'absolute',right:'8vw',bottom:'0vw'}},
      {link:"s2_i2.png", style: {width : '11vw',position: 'absolute',right:'33vw',bottom:'5vw'}},
      {link:"s2_i3.png", style: {width : '6vw',position: 'absolute',right:'3vw',bottom:'8vw'}},
      {link:"s2_i4.png", style: {width : '8vw',position: 'absolute',right:'30vw',bottom:'20vw'}},
      {link:"s2_i5.png", style: {width : '8vw',position: 'absolute',right:'3vw',bottom:'28vw'}},
      {link:"s2_i6.png", style: {width : '6vw',position: 'absolute',right:'12vw',top:'5vw'}},
      {link:"s2_i7.png", style: {width : '10vw',position: 'absolute',right:'27vw',top:'5vw'}},
      {link:"s1_i8.png", style: {width : '3vw',position: 'absolute',right:'10vw',bottom:'20vw',rotate:'-30deg'}},
    ],
    linkPrevious : "/application/new#19",
    linkNext : "/application/new#20",
  },
  'About the Investment': {
    Title: "Investment Validation",
    style: {background:"#8FD7F6"}, 
    ImgData: [
      // {link:"s3_i1.png", style: { width : '60vw',position: 'absolute',right:'0vw',bottom:'2vw'}},
      {link:"s3_i3.png", style: {width : '8vw',position: 'absolute',right:'0vw',bottom:'2vw'}},
      {link:"s3_i4.png", style: {width : '14vw',position: 'absolute',right:'25vw',top:'5vw'}},
      {link:"s3_i5.png", style: {width : '8vw',position: 'absolute',right:'3vw',top:'8vw'}},
      {link:"s3_i9.png", style: {width : '6vw',position: 'absolute',right:'0vw',bottom:'15vw'}},
      {link:"s3_i6.png", style: {width : '16vw',position: 'absolute',right:'10vw',bottom:'15vw'}},
      {link:"s3_i7.png", style: {width : '9vw',position: 'absolute',right:'15vw',bottom:'4vw'}},
      {link:"s3_i8.png", style: {width : '9vw',position: 'absolute',right:'28vw',bottom:'10vw'}},
      {link:"s1_i8.png", style: {width : '3vw',position: 'absolute',right:'40vw',bottom:'20vw',rotate:'100deg'}},
      {link:"s1_i8.png", style: {width : '3vw',position: 'absolute',right:'20vw',top:'-0.2vw',rotate:'0deg'}},
      // {link:"s3_i4.png", style: {width : '10vw',position: 'absolute',right:'10vw',bottom:'25vw'}}
    ],
    linkPrevious : "/application/new#22",
    linkNext : "/application/new#23",
  },
}

export default function WelcomeScreen({ categoryId, nav, categoryName }) {

  // const navigate = useNavigate();

  // function goToQuestion(link){
  //   navigate(link)
  // }

  return (
    <div className="welcomeScreenContainer" style={getData[categoryName].style}>
      <div className="assets_container">
      {getData[categoryName].ImgData.map((data, i) => (
        <img key={i} src={`/images/${data.link}`} style={data.style} alt={data.link}/>
      ))}
      </div>
      <div className="innerContainer welcomeTextColor">
        <p>{categoryName}</p>
        <h1 className="welcomeHeading welcomeTextColor">{getData[categoryName]['Title']}</h1>
        <div className="buttonContainer">
        <a href={`#${(nav) - 1}`} className="navlink">
          <Button variant="contained">Previous</Button>
          </a>
          <div className="horizontal_spacer"></div>
          <a href={`#${(nav) + 1}`} className="navlink">
          <Button variant="contained">Continue</Button>
          </a>
        </div>

        {/* <div className="buttonContainer">
          <Button variant="contained" onClick={() => goToQuestion(getData[categoryName].linkPrevious)}>Previous</Button>
          <div className="horizontal_spacer"></div>
          <Button variant="contained" onClick={() => goToQuestion(getData[categoryName].linkNext)}>Continue</Button>
        </div> */}
      </div>
    </div>
  )
}
