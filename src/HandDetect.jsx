/* eslint-disable no-undef */
/* eslint-disable react/prop-types */

import { ButtomController, CvProject } from "./Components";
import NewCv from "./Components/Cv/newCv";
import { useConstructor, makeid } from "./help";
import annyang from "annyang";

import Flow from "./api/Flow";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CameraModal from "./Components/Modals/CameraModal";
// import CameraAccess from "./Components/Modals/CameraAccess";
// import { LuRefreshCw } from "react-icons/lu";

const HandDetect = (props) => {
  const [isTalking, setIsTalking] = useState(false);
  const audioRef = useRef();
  const BLokedIdList = useRef([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [resultsBox, setResiltsBox] = useState({});
  const [handSide, setHandSide] = useState({});
  const [showCameraModal, setShowCameraModal] = useState(true);
  //Switch Camera
  const videoCameraRef = useRef(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [showHelp,setShowHelp] = useState(false)
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: isFrontCamera ? "user" : "environment",
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoCameraRef.current) {
        videoCameraRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const toggleCamera = () => {
    setIsFrontCamera((prevState) => !prevState);
    // Restart the camera with the new facing mode
    startCamera();
  };

  // useEffect(() => {
  //   console.log(resultsBox.length)
  //   if(resultsBox.length == undefined) {
  //     setTimeout(() => {
  //       setShowHelp(true)
  //     }, 10000);
  //   }else{
  //     setShowHelp(false)
  //   }
  // })
  // Start the camera when the component mounts
  useEffect(() => {
    startCamera();
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
        // sendToApi()
      });
    }
  });
  const [resolveText, setResolveText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const startSpeetchToText = () => {
    setResolveText("");
    annyang.start({ autoRestart: true, continuous: false });
    setIsRecording(true);
    // console.log(annyang.isListening())
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
  useConstructor(() => {
    document.onload = () => {
      configure();
    };
    localStorage.setItem(
      "accessToken",
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZDgwMmZmMzFhIiwiaWF0IjoxNjk5NzYzODk4LCJuYmYiOjE2OTk3NjM4OTgsImp0aSI6ImI2YTYxNGNlLWY1ZWYtNDQ0ZS04ZDJkLTVkYTk2MGEyOWM4ZCIsImV4cCI6MjQ3NzM2Mzg5OCwidHlwZSI6ImFjY2VzcyIsImZyZXNoIjpmYWxzZX0.3xZr9feGtVsxuLpOrfE_Z5vlDRMCpURGog4i7jmco5s"
    );
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
      width: 1280,
      height: 720,
    });
    camera.start();
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
    console.log(resolveText.length > 0);
    if (resolveText.length > 0) {
      const newChat = {
        type: "text",
        like: null,
        message: resolveText,
        from: "user",
        timestamp: 10,
        message_key: makeid(15),
        question: resolveText,
        weekDay: new Date().getDay(),
        month: new Date().getMonth(),
        day: new Date().getDate(),
      };
      chats.push(newChat);
      setChat(chats);
      // setIsLoading(true);
      console.log("try send");
      Flow.chat({
        text: newChat.message,
        language: "English",
        message_key: newChat.message_key,
        apikey: props.apikey,
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
    if (userAgent.includes("mobile") || userAgent.includes("android") || userAgent.includes("iphone")) {
      // For mobile devices, default to "environment"
      setIsFrontCamera(false);
    } else {
      // For laptops/desktops, default to "user"
      setIsFrontCamera(true);
    }
  }, []);
  const resolveWidthBox = () => {
    if (Math.abs(resultsBox[8].x - resultsBox[4].x) * window.innerWidth > 150) {
      return Math.abs(resultsBox[8].x - resultsBox[4].x) * window.innerWidth;
    } else return 150;
  };

  useEffect(() => {
    if (!showCameraModal) {
      configure();
    }
  }, [showCameraModal]);
  const handleClose = () => {
    // Navigate to the specified page
    window.location.href = "https://card-visit-wheat.vercel.app/#/";
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
                      // backgroundColor:'white',
                      transition: "transform 0.2s ease",
                      display: resultsBox.length === 0 && "none",
                      backgroundColor: "rgba(255, 255, 255, .1)",
                      position: "absolute",
                      // opacity:'0.3',
                      zIndex: 200,
                      right: isFrontCamera
                        ? handSide === "Right"
                          ? `${(1 - resultsBox[8].x) * window.innerWidth}px`
                          : undefined
                        : handSide === "Left"
                        ? `${(1 - resultsBox[8].x) * window.innerWidth}px`
                        : undefined,
                      // right: isFrontCamera ? (handSide === "Right" ? `calc(${(1 - resultsBox[8].x) * window.innerWidth}px + 30px)` : undefined) : handSide === "Left" ? `calc(${(1 - resultsBox[8].x) * window.innerWidth}px - 30px)` : undefined,
                      left: isFrontCamera
                        ? handSide === "Left"
                          ? `${resultsBox[8].x * window.innerWidth}px`
                          : undefined
                        : handSide === "Right"
                        ? `${resultsBox[8].x * window.innerWidth}px`
                        : undefined,
                      height: resolveWidthBox() * 1.5,
                      // width: 280,
                      width: resolveWidthBox() + "px",
                      // minWidth: 220,
                      // minHeight: 250,
                      // maxWidth:414,
                      top: `${resultsBox[8].y * window.innerHeight}px`,
                      bottom: `${resultsBox[3].y * window.innerHeight}px`,
                      overflow: "hidden",
                    }}
                  >
                    <NewCv cartHeight={cartHeight} cartWidth={resolveWidthBox()} chats={chat} isTalking={isTalking} apikey={props.apikey} cardData={props.cardData}></NewCv>
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
                      zIndex: 200, // Ensure it's above other content
                    }}
                  >
                    <div className=" flex flex-col items-center">
                      <img src="./../hand-hold.svg" alt="" className="w-[143px] h-[148px]" />
                      <div className=" flex flex-col  items-center leading-[30px] text-[20px] font-[500]">
                        <p className="whitespace-nowrap">Place your hand in front of</p>
                        <p className="whitespace-nowrap">the camera to be detected</p>
                      </div>
                    </div>
                  </div>
                </>
              )      
              :undefined        
            }
            <canvas
              id="output_canvas"
              style={{
                position: "absolute",
                width: "100%",
                height: "100vh",
                top: 0,
                zIndex: 100,
              }}
            ></canvas>
          </div>
          <div style={{ position: "absolute", cursor: "pointer", bottom: 30, right: 50, zIndex: 100 }} onClick={toggleCamera}>
            <div className=" flex justify-center items-center rounded-full h-[44px] w-[44px] bg-white">
              <img src="refresh.svg" alt="" className="w-[20px] h-[20px] bg-white" />
            </div>
          </div>
          <Link
            to="https://card-visit-wheat.vercel.app/#/"
            style={{ position: "absolute", cursor: "pointer", width: "100%", display: "flex", justifyContent: "center", top: 30, left: 0, zIndex: 100 }}
          >
            <div className=" flex justify-center items-center rounded-full h-[44px] w-[44px] bg-white">
              <img src="close.svg" alt="" className="w-[20px] h-[20px] bg-white" />
            </div>
          </Link>
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
            <div style={{ position: "absolute", bottom: 100 }}>{resolveText}</div>
            <div className="">
              <ButtomController isRecording={isRecording} onstart={startSpeetchToText} onstop={stopSpeetchToText}></ButtomController>
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
                autoPlay={isTalking && !isRecording}
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
        onConfirm={() => {
          setShowCameraModal(false);
          configure();
        }}
      />
      {/* <CameraAccess showModal={showCameraModal} /> */}
    </>
  );
};
export default HandDetect;
