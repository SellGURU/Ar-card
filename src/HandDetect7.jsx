/* eslint-disable no-undef */
/* eslint-disable react/prop-types */

import { ButtomController } from "./Components";
import NewCv from "./Components/Cv/newCv";
import { useConstructor, makeid } from "./help";
import annyang from "annyang";

import Flow from "./api/Flow";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CameraModal from "./Components/Modals/CameraModal";
import Auth from "./api/Auth";
import CvScreen2 from "./Components/Cv/CvScreen2";
import { AppContext } from "./store/app";
import AccesNotif from "./Components/AccesNotif";
// import CameraAccess from "./Components/Modals/CameraAccess";
// import { LuRefreshCw } from "react-icons/lu";

const HandDetect5 = (props) => {
  const [isTalking, setIsTalking] = useState(false);
  const audioRef = useRef();
  const BLokedIdList = useRef([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [resultsBox, setResiltsBox] = useState({});
  const [resultLast,setResultLast] = useState([])
  // const [resultLast2,setResultLast2] = useState([])
  const [handSide, setHandSide] = useState({});
  const [showCameraModal, setShowCameraModal] = useState(true);
  const [cameraMode,setCameraMode] =useState("back")
  //Switch Camera
  console.log(resultLast)
  const videoCameraRef = useRef(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [showHelp,setShowHelp] = useState(false)
  const [videoStarted,setVideoStarted] = useState(false)
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: isFrontCamera? "environment" :'user' ,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setVideoStarted(true)

      if (videoCameraRef.current) {
        videoCameraRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };
  function calculateSMA(data, windowSize) {
      if (windowSize <= 0) throw new Error("Window size must be greater than 0");

      let sma = [];
      for (let i = 0; i <= data.length - windowSize; i++) {
          let window = data.slice(i, i + windowSize);
          let average = window.reduce((sum, value) => sum + value, 0) / windowSize;
          sma.push(average);
      }
      return sma;
  }
  const toggleCamera = () => {
    setIsFrontCamera((prevState) => !prevState);
    // Restart the camera with the new facing mode
    startCamera();
  };

  useEffect(() => {
    // console.log(resultsBox.length)
    // console.log(cameraMode)
    
    if(resultsBox.length == undefined && videoStarted) {
      setTimeout(() => {
        setShowHelp(true)
      }, 10000);
    }else{
      setShowHelp(false)
    }
  })
  // Start the camera when the component mounts
  useEffect(() => {
    // startCamera();
    // Clean up - stop the camera when the component unmounts
    return () => {
      if (videoCameraRef.current && videoCameraRef.current.srcObject) {
        const stream = videoCameraRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isFrontCamera]);

  let canvasElement;
  let canvasCtx;
  const ResolveDistance = (dot1, dot2) => {
    return Math.sqrt(Math.pow(dot1.x - dot2.x, 2) + Math.pow(dot1.y - dot2.y, 2));
  };
  //////
  useEffect(() => {
    if (annyang) {
      annyang.addCallback("result", function (phrases) {
        // console.log(phrases)
        setResolveText(phrases[0]);
        // setIsRecording(false)
        // stopSpeetchToText()
        // sendToApi()
      });
    }
  });
  const [resolveText, setResolveText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => {
    if(resolveText.length> 0){
      sendToApi()
    }
  },[resolveText])

  const startSpeetchToText = () => {
    setResolveText("");
    annyang.start({ autoRestart: false, continuous: false });
    setIsRecording(false);
    setIsTalking(false)
    // stopSpeetchToText()
  };
  const stopSpeetchToText = () => {
    annyang.abort();
    sendToApi();
    setIsRecording(false);
  };
  /////
  // const [resetResultsBox, setResetResultsBox] = useState(false);

  useEffect(() => {
    let timeoutId;
    const resetResults = () => {
      setResiltsBox({});
      // setResetResultsBox(true);
    };
    timeoutId = setTimeout(resetResults, 2000);
    return () => clearTimeout(timeoutId);
  }, [resultsBox]);

  const recvResults = (results) => {
    let width = results.image.width;
    let height = results.image.height;
    if (window.innerWidth != canvasElement.width) {
      canvasElement.width = window.innerWidth;
      canvasElement.height = (height * window.innerWidth) / width;
    }
    width = canvasElement.width;
    height = canvasElement.height;
    canvasCtx.save();
    canvasCtx.drawImage(results.image, 0, 0, width, height);
    if (results.multiHandedness) {
      for (const labels of results.multiHandedness) {
        // console.log("labels", labels);
        setHandSide(labels.label);
      }
    }
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        setResiltsBox(landmarks);
        if(resultLast.length< 8){
          let result = resultLast
          result.push(landmarks[8])
          setResultLast(result)
        }else{
          let result = resultLast
          result.shift()
          result.push(landmarks[8])
          setResultLast(result)
        }    
        //DRAW CONNECTORS
        // drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        //   color: "#00FF00",
        //   lineWidth: 2,
        // });
        //DRAW RED POINTS
        // drawLandmarks(canvasCtx, landmarks, {
        //   color: "#FF0000",
        //   lineWidth: 1,
        //   radius: 2,
        // });
        // cvFunction(landmarks, width, height);
        // calcHandState(landmarks, width, height);
        // drawImage();
      }
    }
    canvasCtx.restore();
  };
  // useConstructor(() => {
  //   document.onload = () => {
  //     configure();
  //   };
  // });
  ////
  const appcontext = useContext(AppContext)
  const [searchParams] = useSearchParams();
  const [infoBox,setInfoBox] = useState(props.cardData)
  const [userId,setUserId] = useState('')
  const [prerecorded_voice,setprerecorded_voice]= useState(null)
  const resolveLinkdien =(socialBoxs) => {
    if(socialBoxs.length == 0 ||!socialBoxs.filter(el => el.type =='Linkedin')[0] ){
      return ''
    }else{
      return socialBoxs.filter(el => el.type =='Linkedin')[0].value
    }
  }
  const resolveWeb =(socialBoxs) => {
    if(socialBoxs.length == 0  ){
      return ''
    }else{
      return socialBoxs[0].url
    }
  }
  useConstructor(() => {
    // document.onload = () => {
    //   configure();
    // };
    console.log(searchParams.get("view"))
    Auth.getProfile(searchParams.get('user'),(res) => {
      setInfoBox({
          webAddress:resolveWeb(res?.boxs.filter(el=>el.type_name == 'LinkBox')[0]? res?.boxs.filter(el=>el.type_name == 'LinkBox')[0].links:[]),
          name:res.information.first_name + res.information.last_name ,
          role:res.information.job_title,
          phone:res.information.mobile_number,
          email:res.information.email,
          linkedin:resolveLinkdien(res?.boxs.filter(el=>el.type_name == 'SocialBox')[0]?res?.boxs.filter(el=>el.type_name == 'SocialBox')[0]?.socialMedias:[]),
          silentvideo:res.information.silent_video_url,
          chatvideo:res.information.talking_video_avatar,
          introvideo:res.information.talking_video_avatar        
      })
      appcontext.setUserAccount({
        type:res.type_of_account.type,
        register_date:res.type_of_account.register_date,
        end_of_date:res.type_of_account.end_of_date        
      })
      setprerecorded_voice(res.prerecorded_voice)
      setUserId(res.information.created_userid)
      if(res.prerecorded_voice != null && searchParams.get("view")=="review"){
        setTimeout(() => {
          setAudioUrl(res.prerecorded_voice)
          setIsTalking(true)
          
        }, 3000);
      }
    })
    // localStorage.setItem(
    //   "accessToken",
    //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZDgwMmZmMzFhIiwiaWF0IjoxNjk5NzYzODk4LCJuYmYiOjE2OTk3NjM4OTgsImp0aSI6ImI2YTYxNGNlLWY1ZWYtNDQ0ZS04ZDJkLTVkYTk2MGEyOWM4ZCIsImV4cCI6MjQ3NzM2Mzg5OCwidHlwZSI6ImFjY2VzcyIsImZyZXNoIjpmYWxzZX0.3xZr9feGtVsxuLpOrfE_Z5vlDRMCpURGog4i7jmco5s"
    // );
    setCameraMode(navigator.platform.includes('Win') ||navigator.platform.includes('Mac') ? 'front':'back')
  });
  /////
  // console.log("handSide", handSide);
  const configure = () => {
    // beam = document.getElementById("beam") as HTMLElement;
    //Fetching video elements
    const videoElement = document.getElementById("input_video");
    //Retrieve the Canvas for display
    canvasElement = document.getElementById("output_canvas");
    //Canvas Access information related to drawing.
    canvasCtx = canvasElement.getContext("2d");
    //HandTracking Obtaining and initializing related files for use
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
      },
    });
    hands.setOptions({
      selfieMode: true, //Flip the image horizontally.
      maxNumHands: 1, //The maximum number of recognizable hands.
      modelComplexity: 1, //Settings related to accuracy(0~1)
      minDetectionConfidence: 0.5, //Confidence in hand detection.
      minTrackingConfidence: 0.5, //Confidence in hand tracking
      //   useCpuInference: false, //M1 Mac In the case of Safari, it's true
    });
    hands.onResults(recvResults);
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        //Perform hand detection using the camera's image.
        await hands.send({ image: videoElement });
      },
      facingMode: "environment",
      width: 1280,
      height: 720,
    });
    camera.start();
    setTimeout(() => {
      startCamera()
    
    }, 3000);
    setVideoStarted(true)
  };
  // useEffect(() => {
  //   configure();
  // }, []);
  // console.log("8 to 4 in x ", Math.abs(resultsBox[8].x - resultsBox[4].x));
  // if (resultsBox.length > 0) {
  //   const x8 = resultsBox[8].x;
  //   const y8 = resultsBox[8].y;
  //   const x4 = resultsBox[4].x;
  //   const y4 = resultsBox[4].y;
  //   const alfa = Math.atan((Math.abs(x8 - x4)) /( Math.abs(y8 - y4)));
  //   // console.log((alfa * 180) / Math.PI);
  // }
  const [chat, setChat] = useState([]);
  useEffect(() => {
    if (audioRef.current) {
      const refren = audioRef.current;
      refren.load();
    }
  }, [isTalking]);
  const sendToApi = () => {
    const adminChats = chat.filter((item) => item.from === "admin");
    const chats = chat;
    // console.log(resolveText.length > 0);
    // setIsRecording(false)
    if (resolveText.length > 0 ) {
      const newChat = {
        type: "text",
        like: null,
        message: resolveText,
        from: "user",
        timestamp: makeid(15),
        message_key: makeid(15),
        question: resolveText,
        weekDay: new Date().getDay(),
        month: new Date().getMonth(),
        day: new Date().getDate(),
      };
      // setResolveText("")
      chats.push(newChat);
      setChat(chats);
      // setIsLoading(true);
      console.log("try send");
      Flow.chat({
        text: newChat.message,
        language: "English",
        message_key: newChat.message_key,
        // apikey: props.apikey,
        is_ar:true,
        is_preview: searchParams.get("view") == 'review'? true:false,
        chat_user:adminChats.length > 0 ? adminChats[adminChats.length - 1].chat_user: undefined,
        user_bot_id:userId,
        getcurrentconvesationid: adminChats.length > 0 ? adminChats[adminChats.length - 1].currentconverationid : 1,
      })
        .then((res) => {
          if (res.answer) {
            if (!BLokedIdList.current.includes(res.message_key)) {
              const responseApi = {
                type: "text",
                message: res.answer.answer,
                from: "admin",
                video: res.answer.video_file,
                audio: res.answer.audio_file,
                question: newChat.message,
                currentconverationid: res.currentconverationid,
                weekDay: new Date().getDay(),
                month: new Date().getMonth(),
                day: new Date().getDate(),
                aisles: res.answer.suggestion_list !== "NA" ? res.answer.suggestion_list : [],
                instanceid: res.instanceid,
                chat_user:res.chat_user
                // aisles:JSON.parse(res.suggestion_list),
              };
              chats.push(responseApi);
              setAudioUrl(responseApi.audio);
              setIsTalking(true);
              setChat(chats);
              localStorage.setItem("catchChats", JSON.stringify(chats));
            }
          } else {
            // toast.warning('I did not understand your question, ask your question again',{theme:'colored'})
            // alert('I did not understand your question, ask your question again')
          }
          // console.log(res);
          // setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          // toast.error('Network Connection Error, Please Check Your Connection',{theme:'colored'})
          // setIsLoading(false)
        });
    }
  };
  const [cartWidth, setCartWidth] = useState(null);
  const [cartHeight, setCartHeight] = useState("");
  useEffect(() => {
    if (resultsBox.length > 0) {
      setCartWidth(Math.abs(resultsBox[8].x - resultsBox[4].x) * window.innerWidth);
      setCartHeight(Math.abs(resultsBox[8].y - resultsBox[3].y) * window.innerHeight);
    }
  }, [resultsBox]);
  // console.log(cartWidth);
  // Detect device type and set initial camera mode
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    // if (userAgent.includes("mobile") || userAgent.includes("android") || userAgent.includes("iphone")) {
    //   // For mobile devices, default to "environment"
    //   setIsFrontCamera(false);
    // } else {
      // For laptops/desktops, default to "user"
      setIsFrontCamera(true);
    }
, []);
  const resolveWidthBox = () => {
    if (Math.abs(resultsBox[8].x - resultsBox[4].x) * window.innerWidth > 250) {
      return Math.abs(resultsBox[8].x - resultsBox[4].x).toFixed(1) * window.innerWidth;
    } else return 250;
  };

  const resolveheightBox = () => {
    // console.log(cameraMode)
      // console.log(Math.abs(resultsBox[8].y - resultsBox[1].y) * window.innerHeight)
    if (Math.abs(resultsBox[8].y - resultsBox[1].y) * window.innerHeight > 250) {
      return Math.abs(resultsBox[8].y - resultsBox[1].y).toFixed(1) * window.innerHeight;
    } else return 250;
  };
  useEffect(() => {
    if (!showCameraModal) {
      configure();
    }
  }, [showCameraModal]);
  const handleClose = () => {
    // Navigate to the specified page
    window.location.href = searchParams.get("view") == 'review' ?"https://portal.avatalk.me/#/?review=true&splash=false" : "https://portal.avatalk.me/#/share/?user="+searchParams.get("user");
  };
  return (
    <>
      {!showCameraModal && (
        <div>
          <div>
            <video ref={videoCameraRef} id="input_video" autoPlay playsInline style={{ position: "absolute", display: "none" }}></video>
            {
              resultsBox.length > 0 ? (
                <>
                  <div
                    style={{
                      borderRadius: 14,
                      transition: "transform 0.2s ease",
                      display: resultsBox.length === 0 && "none",
                      // backgroundColor: "rgba(255, 255, 255, .1)",
                      position: "absolute",
                      zIndex: 200,
                      right: cameraMode == 'front'
                        ? handSide === "Right"
                          ? `${(1 - calculateSMA(resultLast.map(e => e.x),3)[0]) * window.innerWidth}px`
                          : undefined
                        : handSide === "Right"
                        ? `${(calculateSMA(resultLast.map(e => e.x),3)[0]) * window.innerWidth}px`
                        : undefined,
                      left: cameraMode == 'front'
                        ? handSide === "Left"
                          ? `${(calculateSMA(resultLast.map(e => e.x),3)[0]) * window.innerWidth}px`
                          : undefined
                        : handSide === "Left"
                        ? `${(1-calculateSMA(resultLast.map(e => e.x),3)[0]) * window.innerWidth}px`
                        : undefined,
                      height: resolveheightBox()+'px',
                      width: resolveheightBox() / 1.5 + "px",
                      top: `${calculateSMA(resultLast.map(e => e.y),3)[0] * window.innerHeight}px`,
                      bottom: `${resultsBox[3].y.toFixed(1) * window.innerHeight}px`,
                      overflow: "visible",
                    }}
                  >

                   <CvScreen2  cartHeight={cartHeight} cartWidth={resolveWidthBox()} chats={chat} isTalking={isTalking} apikey={props.apikey} cardData={infoBox}></CvScreen2>
                    {/* <NewCv cartHeight={cartHeight} cartWidth={resolveWidthBox()} chats={chat} isTalking={isTalking} apikey={props.apikey} cardData={infoBox}></NewCv> */}
                    {/* <CvProject cartHeight={cartHeight} cartWidth={cartWidth} chats={chat} isTalking={isTalking} apikey={props.apikey} cardData={props.cardData}></CvProject> */}
                  </div>
                </>
              ) : undefined
              // undefined
            }
            {
              showHelp ?
              (
                <>
                  {/* Gray layout and loading indicator */}
                  <div
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1050, // Ensure it's above other content
                    }}
                  >
                    <div className=" flex flex-col items-center">
                      <img src="./../hand-hold.svg" alt="" className="w-[143px] h-[148px]" />
                      <div className=" flex flex-col  items-center leading-[30px] text-[20px] font-[500]">
                        <p className="whitespace-nowrap text-white">Place your hand in front of</p>
                        <p className="whitespace-nowrap text-white">the camera to be detected</p>
                      </div>
                    </div>
                  </div>
                </>
              )      
              :undefined        
            }
            <canvas
              id="output_canvas"
              data-mode={cameraMode}
              style={{
                position: "absolute",
                width: "100%",
                height: "100vh",
                top: 0,
                zIndex: 100,
              }}
            ></canvas>
          </div>

          {/* <Link
            to={searchParams.get("view") == 'review' ?"https://portal.avatalk.me/#/?review=true&splash=false" : "https://portal.avatalk.me/#/share/?user="+searchParams.get("user")}
            style={{ position: "absolute", cursor: "pointer", width: "100%", display: "flex", justifyContent: "center", top: 30, left: 0, zIndex: 100 }}
          >
            <div className=" flex justify-center items-center rounded-full h-[44px] w-[44px] bg-white">
              <img src="close.svg" alt="" className="w-[20px] h-[20px] bg-white" />
            </div>
          </Link> */}
          <div
            // className=" absolute bottom-[60px] w-[100%] flex justify-center left-0 right-0 mx-auto"
            style={{
              position: "absolute",
              bottom: 50,
              zIndex: 600,
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="absolute bottom-16 text-center">
              <div style={{ marginBottom:'10px' }}>{resolveText}</div>
              <AccesNotif></AccesNotif>

            </div>
            <div className="">
              <ButtomController isRecording={annyang.isListening()} onstart={startSpeetchToText} onstop={stopSpeetchToText}></ButtomController>
            </div>
          </div>

          <div
            style={{
              visibility: "hidden",
              top: 0,
              left: 0,
              position: "absolute",
              width: "0px",
              height: "0px",
            }}
          >
            <div style={{ position: "absolute", zIndex: 300 }}>
              <audio
                ref={audioRef}
                controls
                onEnded={() => {
                  setAudioUrl("");
                  setIsTalking(false);
                  // if(chat.length == 0){
                  //   setTimeout(() => {
                  //     setShowSuggestion(true)
                  //   }, 20000);
                  // }
                }}
                autoPlay={isTalking && !annyang.isListening()}
              >
                <source id="audioPlayer" src={audioUrl} type="audio/mpeg" />
              </audio>
            </div>
          </div>
        </div>
      )}
      <CameraModal
        isOpen={showCameraModal}
        onClose={handleClose}
        onConfirm={async () => {
          setShowCameraModal(false);
          await navigator.permissions.query( { name: "camera" } );
          await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          configure();
        }}
      />
      {/* <CameraAccess showModal={showCameraModal} /> */}
    </>
  );
};
export default HandDetect5;
