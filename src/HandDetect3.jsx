/* eslint-disable no-undef */
/* eslint-disable react/prop-types */

import { ButtomController, CvProject } from "./Components";

import { useConstructor, makeid } from "./help";
import annyang from "annyang";

import Flow from "./api/Flow";
import { useEffect, useRef, useState } from "react";

const HandDetect3 = (props) => {
  const [isTalking, setIsTalking] = useState(false);
  const audioRef = useRef();
  const BLokedIdList = useRef([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [resultsBox, setResiltsBox] = useState({});
  const [handSide, setHandSide] = useState({});
  //Switch Camera
  const videoCameraRef = useRef(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
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

  //Rotation around axesis:

  const videoRef = useRef(null);

  // const rotateVideo = () => {
  //   const newDegree = rotationDegree + parseInt(customDegree);
  //   setRotationDegree(newDegree);
  //   videoRef.current.style.transform = `rotateZ(${newDegree}deg)`;
  // };

  // useEffect(() => {
  //   if (resultsBox.length > 0) {
  //     const x8 = resultsBox[8].x;
  //     const y8 = resultsBox[8].y;
  //     const z8 = Math.abs(resultsBox[8].z);
  //     const x4 = resultsBox[4].x;
  //     const y4 = resultsBox[4].y;
  //     const z4 = Math.abs(resultsBox[4].z);
  //     //ROTATE AROUND Z-AXIS
  //     if (x8 > x4) {
  //       const alfa = Math.atan(Math.abs(x8 - x4) / Math.abs(y8 - y4));
  //       const alfaDegree = (alfa * 180) / Math.PI;

  //       // console.log((alfa * 180) / Math.PI);
  //       videoRef.current.style.transform = `rotateZ(${alfaDegree}deg)`;
  //       // console.log("alfaDegree", alfaDegree);
  //     } else if (x8 < x4) {
  //       const alfa = Math.atan(Math.abs(x8 - x4) / Math.abs(y8 - y4));
  //       const alfaDegree = ((alfa * 180) / Math.PI) * -1;

  //       // console.log((alfa * 180) / Math.PI);
  //       videoRef.current.style.transform = `rotateZ(${alfaDegree}deg)`;
  //       // console.log("alfaDegree", alfaDegree);
  //     }
  //     //ROTATE AROUND X-AXIS:
  //   }
  // }, [resultsBox]);
  useEffect(() => {
    if (resultsBox.length > 0) {
      const x8 = resultsBox[8].x;
      const y8 = resultsBox[8].y;
      const z8 = Math.abs(resultsBox[8].z);
      const x4 = resultsBox[3].x;
      const y4 = resultsBox[3].y;
      const z4 = Math.abs(resultsBox[4].z);
      // console.log("x8-x4", x8 - x4);
      // ROTATE AROUND Z-AXIS
      if (isFrontCamera) {
        if (x8 > x4) {
          const alfaZ = Math.atan(Math.abs(x8 - x4) / Math.abs(y8 - y4));
          const alfaDegreeZ = (alfaZ * 180) / Math.PI;
          videoRef.current.style.transform = `rotateZ(${alfaDegreeZ}deg)`;
          // videoRef.current.style.transform += ` translateY(${
          //   handSide === "Right" ? -40 : 100
          // }px)`;
          // videoRef.current.style.transform += ` translateX(${
          //   handSide === "Right" ? 0 : -130
          // }px)`;
        } else if (x8 < x4) {
          // videoRef.current.style.transform = ` translateY(${-50}px)`;
          const alfaZ = Math.atan(Math.abs(x8 - x4) / Math.abs(y8 - y4));
          const alfaDegreeZ = ((alfaZ * 180) / Math.PI) * -1;
          videoRef.current.style.transform = `rotateZ(${alfaDegreeZ}deg)`;
        }
      } else {
        if (x8 > x4) {
          const alfaZ = Math.atan(Math.abs(x8 - x4) / Math.abs(y8 - y4));
          const alfaDegreeZ = (alfaZ * 180) / Math.PI;
          videoRef.current.style.transform = `rotateZ(${alfaDegreeZ}deg)`;
        } else if (x8 < x4) {
          // videoRef.current.style.transform = ` translateY(${-50}px)`;
          const alfaZ = Math.atan(Math.abs(x8 - x4) / Math.abs(y8 - y4));
          const alfaDegreeZ = ((alfaZ * 180) / Math.PI) * -1;
          videoRef.current.style.transform = `rotateZ(${alfaDegreeZ}deg)`;
        }
      }

      // SET TRANSFORM ORIGIN TO CENTER
      videoRef.current.style.transformOrigin = "center center";
    }
  }, [resultsBox, handSide, isFrontCamera]);

  // if (resultsBox.length > 0) {
  //   console.log("resultsBox[8].x", resultsBox[8].x);
  //   console.log("resultsBox[8].y", resultsBox[8].y);
  //   console.log("resultsBox[8].z", Math.abs(resultsBox[8].z));
  //   console.log("resultsBox[4].x", resultsBox[4].x);
  //   console.log("resultsBox[4].y", resultsBox[4].y);
  //   console.log("resultsBox[4].z", Math.abs(resultsBox[4].z));
  // }
  // const handleInputChange = (e) => {
  //   const value = e.target.value;
  //   // Validate if the entered value is a number or a minus sign followed by a number
  //   if (/^-?\d*\.?\d+$/.test(value) || value === "-" || value === "") {
  //     setCustomDegree(value);
  //   }
  // };

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
        // setResetResultsBox(false);
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 2,
        });
        drawLandmarks(canvasCtx, landmarks, {
          color: "#FF0000",
          lineWidth: 1,
          radius: 2,
        });
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
    localStorage.setItem("accessToken", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZDgwMmZmMzFhIiwiaWF0IjoxNjk5NzYzODk4LCJuYmYiOjE2OTk3NjM4OTgsImp0aSI6ImI2YTYxNGNlLWY1ZWYtNDQ0ZS04ZDJkLTVkYTk2MGEyOWM4ZCIsImV4cCI6MjQ3NzM2Mzg5OCwidHlwZSI6ImFjY2VzcyIsImZyZXNoIjpmYWxzZX0.3xZr9feGtVsxuLpOrfE_Z5vlDRMCpURGog4i7jmco5s");
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
  return (
    <>
      <div style={{}}>
        <button style={{ position: "absolute", right: 0, zIndex: 300 }} onClick={toggleCamera}>
          Switch Camera
        </button>
        <button
          style={{ position: "absolute", right: 0, zIndex: 300 }}
          onClick={() => {
            configure();
          }}
        >
          ready
        </button>
        {/* <div
          style={{
            position: "absolute",
            right: 0,
            zIndex: 300,
            marginTop: "100px",
          }}
        >
          <input
            type="text"
            value={customDegree}
            onChange={handleInputChange}
            placeholder="Enter custom degree"
          />
          <button onClick={rotateVideo}>Rotate</button>
        </div> */}
        <video ref={videoCameraRef} id="input_video" autoPlay playsInline style={{ position: "absolute", display: "none" }}></video>
        {resultsBox.length > 0 ? (
          <>
            {/* <video
              autoPlay
              muted
              // ref={videoRef}
              loop
              style={{
                transition: "transform 0.2s ease",
                display: resultsBox.length === 0 && "none",
                position: "absolute",
                objectFit: "fill",
                zIndex: 200,
                // right: `${(1 - resultsBox[8].x) * window.innerWidth}px`,
                top: `${resultsBox[8].y * window.innerHeight}px`,
                height: `${
                  Math.abs(resultsBox[8].y - resultsBox[4].y) *
                  window.innerHeight
                }px`,
                // width: undefined,
                width:
                  Math.abs(resultsBox[8].x - resultsBox[4].x) > 0.2
                    ? `${
                        Math.abs(resultsBox[8].x - resultsBox[4].x) *
                        window.innerWidth
                      }px`
                    : undefined,
                // width: `${
                //   Math.abs(resultsBox[8].x - resultsBox[4].x) * window.innerWidth
                // }px`,

                right: isFrontCamera
                  ? handSide === "Right"
                    ? `${(1 - resultsBox[8].x) * window.innerWidth}px`
                    : undefined
                  : handSide === "Left"
                  ? `${(1 - resultsBox[8].x) * window.innerWidth}px`
                  : undefined,
                left: isFrontCamera
                  ? handSide === "Left"
                    ? `${resultsBox[8].x * window.innerWidth}px`
                    : undefined
                  : handSide === "Right"
                  ? `${resultsBox[8].x * window.innerWidth}px`
                  : undefined,
                // right:
                //   handSide === "Right"
                //     ? `${100 - resultsBox[8].x * 100}%`
                //     : undefined,
                // left:
                //   handSide === "Left" ? `${resultsBox[8].x * 100}%` : undefined,
                // height:
                //   ResolveDistance(resultsBox[8], resultsBox[3]) *
                //   window.innerHeight,
                // width:
                //   ResolveDistance(resultsBox[4], resultsBox[0]) *
                //   window.innerWidth,
                // bottom: `${100 - resultsBox[2].y * 100}%`,
              }}
              src="./lion.mp4"
            ></video> */}
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
                right: isFrontCamera ? (handSide === "Right" ? `${(1 - resultsBox[8].x) * window.innerWidth}px` : undefined) : handSide === "Left" ? `${(1 - resultsBox[8].x) * window.innerWidth}px` : undefined,
                // right: isFrontCamera ? (handSide === "Right" ? `calc(${(1 - resultsBox[8].x) * window.innerWidth}px + 30px)` : undefined) : handSide === "Left" ? `calc(${(1 - resultsBox[8].x) * window.innerWidth}px - 30px)` : undefined,
                left: isFrontCamera ? (handSide === "Left" ? `${resultsBox[8].x * window.innerWidth}px` : undefined) : handSide === "Right" ? `${resultsBox[8].x * window.innerWidth}px` : undefined,
                height: Math.abs(resultsBox[8].y - resultsBox[3].y) * window.innerHeight,
                // width: 280,
                width: Math.abs(resultsBox[8].x - resultsBox[4].x) * window.innerWidth,
                minWidth: 220,

                top: `${resultsBox[8].y * window.innerHeight}px`,
                bottom: `${resultsBox[3].y * window.innerHeight}px`,
                overflow: "hidden",
              }}
            >
              <CvProject cartHeight={cartHeight} cartWidth={cartWidth} chats={chat} isTalking={isTalking} apikey={props.apikey} cardData={props.cardData}></CvProject>
            </div>
          </>
        ) : undefined}
        <img
          id="beam"
          src="./processed-41be68d3-7674-435f-811b-00f1b3a7a576_7RxyJBHt.jpeg"
          style={{
            position: "absolute",
            display: "none",
          }}
        />
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
        <div className=" mx-auto">
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
    </>
  );
};
export default HandDetect3;
