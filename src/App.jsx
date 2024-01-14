import { createHashRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HandDetect2 from "./HandDetect2";
import HandDetect from "./HandDetect";
import Resome from "./Resume.json";
import { useConstructor } from "./help";
import Resume from "./api/Resume";
import { MoonLoader } from "react-spinners";
import HandDetect3 from "./HandDetect3";

function App() {
  const [boxWidth, setBoxWidth] = useState(window.innerWidth);
  const [boxHeight, setBoxHeight] = useState(window.innerHeight);
  const [resumes, setResume] = useState(Resome);
  const [isLoading, setIsLaoding] = useState(true);
  // console.log(Resome)
  const [router, setRouter] = useState(
    createHashRouter([
      {
        path: "detect1",
        element: <HandDetect></HandDetect>,
      },
    ])
  );
  useConstructor(() => {
    // Resume.getAll((res) => {
    //   console.log(res)
    //   setResume(res)
    //   const resolveRouter = res.map((item) => {
    //     return {
    //       path:item.path,
    //       element: <HandDetect2 apikey={item.apikey} cardData={item.cardData} />,
    //     }
    //   })
    //   setRouter(createHashRouter(resolveRouter));
    //   setIsLaoding(false)
    // })
    setTimeout(() => {
      const resolveRouter = resumes.map((item) => {
        return {
          path: item.path,
          element: (
            <HandDetect2 apikey={item.apikey} cardData={item.cardData} />
          ),
        };
      });
      resolveRouter.push({
        path: "detect1",
        element: (
          <HandDetect
            apikey={resumes[0].apikey}
            cardData={resumes[0].cardData}
          ></HandDetect>
        ),
      });
      resolveRouter.push({
        path: "detect3",
        element: (
          <HandDetect3
            apikey={resumes[0].apikey}
            cardData={resumes[0].cardData}
          ></HandDetect3>
        ),
      });
      setRouter(createHashRouter(resolveRouter));
      setIsLaoding(false);
    }, 300);
  });

  const handleResize = () => {
    setBoxWidth(window.innerWidth);
    setBoxHeight(window.innerHeight);
  };
  useEffect(() => {
    setBoxWidth(window.innerWidth);
    console.log(router);
    setBoxHeight(window.innerHeight);
    window.addEventListener("resize", handleResize, false);
  }, []);
  return (
    <div
      style={{
        backgroundColor: "white",
        marginTop: "0px",
        overflow: "hidden",
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!isLoading && resumes.length > 0 ? (
        <RouterProvider router={router} />
      ) : undefined}
      {isLoading ? (
        <div
          style={{
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: "black",
            position: "absolute",
            zIndex: 50,
            top: 0,
            left: 0,
            opacity: "0.4",
          }}
        ></div>
      ) : undefined}
      {isLoading ? (
        <div
          style={{
            position: "absolute",
            width: window.innerWidth,
            height: window.innerHeight,
            display: "flex",
            zIndex: 51,
            justifyContent: "center",
            top: 0,
            left: 0,
            alignItems: "center",
          }}
        >
          <MoonLoader color="#0c63f0" />
        </div>
      ) : undefined}
      <ToastContainer />
    </div>
  );
}

export default App;
