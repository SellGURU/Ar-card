/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useConstructor } from "../../help";

const CvScreen2 = (props) => {
    const videoRef = useRef();
    const videoRef2 = useRef();
    const [isRecording, setIsRecording] = useState(false); 
    const [videourl, setvideourl] = useState();
    // useEffect(() => {
    //     if (videoRef.current) {
    //         const refren = videoRef.current;
    //         refren.load();
    //     }
    // }, [props.isTalking]);  
    // useEffect(() => {
    //     if (videoRef2.current) {
    //         const refren = videoRef2.current;
    //         refren.load();
    //     }
    // }, [props.isTalking]);      
    useConstructor(() => {
        setvideourl(props.cardData.silentvideo);
        console.log(props.cartWidth)
    });    
    useEffect(() => {
        console.log(props.isTalking)
        if(props.isTalking == false) {
            setvideourl(props.cardData.silentvideo);
            // setTimeout(() => {
            //     const refren = videoRef.current;
            //     refren.load();
                
            // }, 200);       
        }else{
            setvideourl(props.cardData.chatvideo);
            // setTimeout(() => {
            //     const refren = videoRef.current;
            //     refren.load();
                
            // }, 200);       
        }
    },[props.isTalking])      
    return (
        <>
             <div className="overflow-visible w-full h-full ">
                <div className="w-ful h-full flex justify-center items-center">
                    <div className="w-full relative">
                        <img id="avatarLogoBox" className="w-full" src="./4.svg" alt="" />

                        <video
                            id="dragAbleAi"
                            playsInline
                            ref={videoRef}
                            width={'65%'}
                            // style={{ marginTop: `calc(${marginValue} - 5px)`, borderRadius: "100%", width: videoWidth }}
                            className={`pk_video absolute ${props.isTalking?'visible':'invisible'} border-8 border-white  rounded-full `}
                            style={{
                                left:'50%',
                                top:'48%',
                                transform:'translate(-50%, -50%)'
                            }}
                            preload="auto"
                            autoPlay={!isRecording}
                            loop
                            muted
                        >
                            <source id="videoPlayer" key={props.cardData.chatvideo} src={props.cardData.chatvideo} type="video/mp4"></source>
                        </video>    
                        <video
                            id="dragAbleAi"
                            playsInline
                            ref={videoRef2}
                            width={'65%'}
                            // style={{ marginTop: `calc(${marginValue} - 5px)`, borderRadius: "100%", width: videoWidth }}
                            className={`pk_video absolute border-8 ${!props.isTalking?'visible':'invisible'}  border-white  rounded-full `}
                            style={{
                                left:'50%',
                                top:'48%',
                                transform:'translate(-50%, -50%)'
                            }}
                            preload="auto"
                            autoPlay={!isRecording}
                            loop
                            muted
                        >
                            <source id="videoPlayer" key={props.cardData.silentvideo} src={props.cardData.silentvideo} type="video/mp4"></source>
                        </video>     
                        {props.cardData.phone!= '' ?
                            <div onClick={() => {
                                window.open("tel:"+props.cardData.phone)
                            }} style={{width:props.cartHeight * 15 /100 ,height:props.cartHeight * 15 /100}} className=" flex justify-center items-center rounded-full bg-[#F3F4F6] opacity-70 -top-4 left-14 border absolute border-white">
                                <img src="./call.svg" />
                            </div>  
                        :
                            <div  style={{width:props.cartHeight * 15 /100 ,height:props.cartHeight * 15 /100}} className=" flex justify-center items-center opacity-20 rounded-full bg-[#F3F4F6] -top-4 left-14 border absolute border-white">
                                <img src="./call.svg" />
                            </div>                          
                        }                                               
                        {props.cardData.linkedin != '' ?
                            <div onClick={() => {
                                window.open("tel:"+props.cardData.linkedin)
                            }} style={{width:props.cartHeight * 15 /100 ,height:props.cartHeight * 15 /100}} className=" flex justify-center items-center rounded-full bg-[#F3F4F6] opacity-70 top-3 left-3 border absolute border-white">
                                <img src="./linkden.svg" />
                            </div>      
                        :<div  style={{width:props.cartHeight * 15 /100 ,height:props.cartHeight * 15 /100}} className=" flex justify-center items-center rounded-full bg-[#F3F4F6] opacity-20 top-3 left-3 border absolute border-white">
                                <img src="./linkden.svg" />
                            </div>     }
                        {props.cardData.webAddress != '' ?
                            <div onClick={() => {
                                window.open("tel:"+props.cardData.webAddress)
                            }} style={{width:props.cartHeight * 15 /100 ,height:props.cartHeight * 15 /100}} className=" flex justify-center items-center rounded-full bg-[#F3F4F6] opacity-70 top-14 -left-3 border absolute border-white">
                                <img src="./global.svg" />
                            </div> 
                        :   <div style={{width:props.cartHeight * 15 /100 ,height:props.cartHeight * 15 /100}} className=" flex justify-center opacity-20 items-center rounded-full bg-[#F3F4F6]  top-14 -left-3 border absolute border-white">
                                <img src="./global.svg" />
                            </div> }
                        {props.cardData.email != '' ?
                        <div onClick={() => {
                            window.open("tel:"+props.cardData.email)
                        }} style={{width:props.cartHeight * 15 /100 ,height:props.cartHeight * 15 /100}} className=" flex justify-center items-center rounded-full bg-[#F3F4F6] opacity-70 top-[106px] -left-6 border absolute border-white">
                            <img src="./sms.svg" />
                        </div>                                                                                              
                        :
                         <div style={{width:props.cartHeight * 15 /100 ,height:props.cartHeight * 15 /100}} className=" flex justify-center items-center rounded-full bg-[#F3F4F6] opacity-20 top-[106px] -left-6 border absolute border-white">
                            <img src="./sms.svg" />
                        </div>       
                        }
                    </div>
                </div>
             </div>        
        </>
    )
}

export default CvScreen2