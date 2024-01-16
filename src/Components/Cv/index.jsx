/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { useConstructor } from "../../help";

const CvProject = (props) => {
  const videoRef = useRef();
  const [videourl, setvideourl] = useState();
  const [isRecording, setIsRecording] = useState(false);
  useConstructor(() => {
    console.log(props);
    setvideourl(props.cardData.silentvideo);
  });
  console.log(props.cartHeight);
  let fontSize; // Default font size
  let marginValue;
  let videoWidth;
  let fontWeight;
  if (props.cartWidth < 200) {
    fontSize = "14px";
    fontWeight = 400;
  } else if (props.cartWidth < 300) {
    fontSize = "16px";
    fontWeight = 500;
  } else if (props.cartWidth < 400) {
    fontSize = "18px";
    fontWeight = 600;
  } else {
    fontSize = "20px";
    fontWeight = 700;
  }
  if (props.cartHeight < 250) {
    marginValue = "10px";
    videoWidth = "50px";
  } else if (props.cartHeight < 300) {
    marginValue = "20px";
    videoWidth = "80px";
  } else if (props.cartHeight < 350) {
    marginValue = "40px";
    videoWidth = "100px";
  } else if (props.cartHeight < 400) {
    marginValue = "60px";
    videoWidth = "120px";
  } else if (props.cartHeight < 450) {
    marginValue = "80px";
    videoWidth = "140px";
  } else {
    marginValue = "100px";
    videoWidth = "160px";
  }
  // console.log("cartWidth", props.cartWidth);
  return (
    <>
      <div style={{ overflow: "hidden" }}>
        {/* <div style={{ display: "flex", zIndex: 20, top: 20, justifyContent: "center", width: "100%", position: "absolute" }}> */}
        <div className=" flex flex-col bg-[#020102]/70  rounded-[14px] " style={{ height: props.cartHeight }}>
          <video id="dragAbleAi" playsInline ref={videoRef} style={{ marginTop: `calc(${marginValue} - 5px)`, borderRadius: "100%", width: videoWidth }} className="pk_video  justify-center  flex mx-auto" preload="auto" autoPlay={!isRecording} loop muted>
            <source id="videoPlayer" key={videourl} src={videourl} type="video/mp4"></source>
          </video>
          <div className="min-h-[415px] max-h-[515px] mt-4 px-6">
            <div className=" flex flex-col  ">
              <div className=" leading-[27px]  mb-2 " style={{ fontSize: fontSize, fontWeight: fontWeight }}>
                <span className="  border-b-2 ">CO</span>
                <span>NTACT</span>
              </div>
              <div className=" flex items-center space-x-1 justify-between leading-[24px] mb-[2px]  font-[500]" style={{ fontSize: `calc(${fontSize} - 4px)` }}>
                <div
                  onClick={() => {
                    window.open("tel:" + props.cardData.phone);
                  }}
                  className=" flex items-center space-x-1"
                >
                  <img src="./call2.svg" alt="" />
                  <div className=" cursor-pointer">{props.cardData.phone}</div>
                </div>
                <div
                  className=" flex items-center space-x-1 "
                  onClick={() => {
                    window.open(props.cardData.linkedin);
                  }}
                >
                  <img src="./linkedin2.svg" alt="" />
                  <div className=" cursor-pointer">Linkedin</div>
                </div>
              </div>
              <div className=" flex items-center space-x-1 justify-between leading-[24px] font-[500]" style={{ fontSize: `calc(${fontSize} - 4px)` }}>
                <div
                  onClick={() => {
                    window.open("mailto:" + props.cardData.email + "?cc=&subject=");
                  }}
                  className=" flex items-center space-x-1"
                >
                  <img src="./email2.svg" alt="" />
                  <div className=" cursor-pointer">{props.cardData.email}</div>
                </div>
                <div
                  className=" flex items-center space-x-1 "
                  onClick={() => {
                    window.open("https://" + props.cardData.webAddress);
                  }}
                >
                  <img src="./global2.svg" alt="" />
                  <div className=" cursor-pointer">codie.ai</div>
                </div>
              </div>
            </div>
            <div className="flex  flex-col items-center justify-center leading-[24px] font-[500] " style={{ paddingTop: `calc(${marginValue} - 40px)`, fontSize: `calc(${fontSize} - 4px)` }}>
              <p className="whitespace-nowrap">Hello, To get to know me better, </p>
              <p className="whitespace-nowrap">ask me questions</p>
            </div>
          </div>

          {/* <video autoPlay style={{borderRadius:'100%',width:'138px',height:'100%',border:'2px solid white'}} src="./images/01.mp4"></video> */}
          {/* <img src="./images/user.png" style={{width:'138px',height:'138px',borderRadius:'100%'}} /> */}
        </div>
      </div>
    </>
  );
};
export default CvProject;
