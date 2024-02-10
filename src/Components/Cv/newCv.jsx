/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";
import { useConstructor } from "../../help";

const NewCv =(props) => {
    const videoRef = useRef();
    const [videourl, setvideourl] = useState();
    const [isRecording, setIsRecording] = useState(false);    
    const fontsizeTitleResolver = () => {
        if (props.cartWidth < 200) {
            return '10px'
        } else if (props.cartWidth < 300) {
            return '12px'
        } else if (props.cartWidth < 400) {
            return '14px'
        } else {
            return '16px'
        }
    }
    useEffect(() => {
        if (videoRef.current) {
            const refren = videoRef.current;
            refren.load();
        }
    }, [props.isTalking]);    
    const fontsizeTitleResolver2 = () => {
        if (props.cartWidth < 200) {
            return '8px'
        } else if (props.cartWidth < 300) {
            return '10px'
        } else if (props.cartWidth < 400) {
            return '12px'
        } else {
            return '14px'
        }
    }    
    useConstructor(() => {
        setvideourl(props.cardData.silentvideo);
    });    
    useEffect(() => {
        console.log(props.isTalking)
        if(props.isTalking == false) {
            setvideourl(props.cardData.silentvideo);
            setTimeout(() => {
                const refren = videoRef.current;
                refren.load();
                
            }, 200);       
        }else{
            setvideourl(props.cardData.chatvideo);
            setTimeout(() => {
                const refren = videoRef.current;
                refren.load();
                
            }, 200);       
        }
    },[props.isTalking])
    return (
        <>
            <div className="overflow-hidden bg-[#020102]/75 w-full h-full ">
                <video
                    id="dragAbleAi"
                    playsInline
                    ref={videoRef}
                    width={'45%'}
                    // style={{ marginTop: `calc(${marginValue} - 5px)`, borderRadius: "100%", width: videoWidth }}
                    className="pk_video rounded-full mt-3 justify-center  flex mx-auto"
                    preload="auto"
                    autoPlay={!isRecording}
                    loop
                    muted
                >
                    <source id="videoPlayer" key={videourl} src={videourl} type="video/mp4"></source>
                </video>                
                <div className="px-4">
                    <div className=" leading-[27px]  mb-2 text-sm " style={{fontSize:fontsizeTitleResolver(),marginTop:'8%'}}>
                        <span className="  border-b-2 ">CO</span>
                        <span>NTACT</span>
                    </div> 
                    <div className=" flex items-center space-x-1 justify-between mt-2 leading-[24px] mb-[2px]  font-[500]" style={{ fontSize: `calc(${fontsizeTitleResolver()} - 4px)` }}>
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
                    <div className=" flex items-center space-x-1 justify-between leading-[24px] font-[500]" style={{ fontSize: fontsizeTitleResolver2() }}>
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
                <div className="flex  flex-col items-center absolute bottom-4 w-full justify-center font-[500] " style={{ fontSize: fontsizeTitleResolver2() }}>
                <div className="whitespace-nowrap">Hello, To get to know me better, </div>
                <div className="whitespace-nowrap">ask me questions</div>
                </div>                
            </div>
        </>
    )
}

export default NewCv