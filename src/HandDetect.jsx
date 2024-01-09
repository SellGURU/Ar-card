/* eslint-disable no-undef */

import { useConstructor } from "./help";

import { useEffect, useState } from "react";

const HandDetect = () => {
  let canvasElement;
  let canvasCtx;
  const ResolveDistance = (dot1, dot2) => {
    return Math.sqrt(
      Math.pow(dot1.x - dot2.x, 2) + Math.pow(dot1.y - dot2.y, 2)
    );
  };
  const [resultsBox, setResiltsBox] = useState({});
  const [handSide, setHandSide] = useState({});
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
  useConstructor(() => {
    document.onload = () => {
      configure();
    };
  });
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
  console.log("resultsBox.length", resultsBox.length);
  return (
    <>
      <div style={{}}>
        <button
          style={{ position: "absolute", right: 0, zIndex: 300 }}
          onClick={() => {
            configure();
          }}
        >
          ready
        </button>
        <video
          id="input_video"
          autoPlay
          playsInline
          style={{ position: "absolute", display: "none" }}
        ></video>
        {resultsBox.length > 0 ? (
          <video
            autoPlay
            muted
            loop
            style={{
              display: resultsBox.length === 0 && "none",
              position: "absolute",
              objectFit: "fill",
              zIndex: 200,
              // right: `${(1 - resultsBox[8].x) * window.innerWidth}px`,
              top: `${resultsBox[8].y * window.innerHeight}px`,
              height: `${
                Math.abs(resultsBox[8].y - resultsBox[4].y) * window.innerHeight
              }px`,
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

              right:
                handSide === "Right"
                  ? `${(1 - resultsBox[8].x) * window.innerWidth}px`
                  : undefined,
              left:
                handSide === "Left"
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
          ></video>
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
          // style={{ position: "absolute", top: 0, zIndex: 100 }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100vh",
            top: 0,
            zIndex: 100,
          }}
        ></canvas>
      </div>
    </>
  );
};
export default HandDetect;
