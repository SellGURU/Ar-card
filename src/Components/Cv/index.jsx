/* eslint-disable react/prop-types */
import { useEffect, useRef, useState} from "react";
import { useConstructor } from "../../help";

const CvProject = (props) => {
    const videoRef = useRef();
    const [videourl,setvideourl] = useState()
    const [isRecording,setIsRecording] = useState(false)        
    useEffect(() => {
        if(props.isTalking){
            setvideourl(props.cardData.chatvideo)
        }else {
            setvideourl(props.cardData.silentvideo)
        }
        if(videoRef.current && !isRecording){
            const refren = videoRef.current 
            // setShowOpacity(true)
            refren.load()
        }           
    },[props.isTalking])        
    useConstructor(() => {
        console.log(props)
        setvideourl(props.cardData.silentvideo)
    })
    useEffect(() => {

    })
    return (
        <>
            <div style={{overflow:'hidden'}}>
                <div style={{display:'flex',zIndex:20,top:'5%',justifyContent:'center',width:'100%',position:'absolute'}}>
                    <video id="dragAbleAi" playsInline ref={videoRef} height={'30%'} style={{borderRadius:'100%'}} className="pk_video" preload="auto" width={'30%'} autoPlay={!isRecording} loop muted >
                        <source id="videoPlayer" key={videourl}  src={videourl} type="video/mp4"></source>
                    </video> 
                    {/* <div style={{display:'flex',width:'100%',position:'absolute',top:'150px',zIndex:12,justifyContent:'center'}}>
                        <div style={{backgroundColor:'#EBEBEB',maxWidth:'290px',width:'100%',minHeight:'215px',paddingBottom:'16px',maxHeight:'315px',position:'relative'}}>
                            <div style={{backgroundColor:'#FBAD37',zIndex:2,width:'102px',height:'20px',position:'absolute',left:'0px',top:40}}></div>
                            <div style={{backgroundColor:'#253343',zIndex:1,width:'1px',height:'89px',position:'absolute',left:'66px',top:0}}></div>
                            <div style={{color:'#253343',fontSize:'22px',fontWeight:400,marginTop:'36px',fontFamily:'Poppins-Regular',marginLeft:'120px'}}>
                                <div style={{whiteSpace:'pre-line',lineHeight:'27px'}}>{props.cardData.name}</div>
                            </div>
                            <div style={{display:'flex',justifyContent:'start',alignItems:'center'}}>
                                <div style={{color:'#445A74',fontSize:'16px',width:'500px',fontFamily:'Poppins-Regular',marginLeft:'120px'}}>{props.cardData.role}</div>
                            </div>
                            <div style={{width:'100%',display:'flex',justifyContent:'start'}}>
                                <div style={{marginLeft:59,marginTop:16}}>
                                <div onClick={() => {
                                    window.open('https://'+props.cardData.webAddress)
                                }} style={{display:'flex',justifyContent:'start',marginRight:24}}>
                                    <img style={{width:'16px'}}  src="./global.svg" alt="" />
                                    <div style={{color:'#253343',marginLeft:'8px',textDecoration:'underline',cursor:'pointer',fontSize:'12px',fontFamily:'Poppins-Regular'}}>{props.cardData.webAddress}</div>
                                </div>
                                <div onClick={() => {
                                    window.open("tel:"+props.cardData.phone);   
                                }} style={{display:'flex',justifyContent:'start',marginTop:'4px',marginRight:24}}>
                                    <img src="./call.svg" alt="" />
                                    <div style={{color:'#253343',marginLeft:'8px',cursor:'pointer',fontSize:'12px',fontFamily:'Poppins-Regular'}}>{props.cardData.phone}</div>
                                </div>
                                <div onClick={() => {
                                    window.open("mailto:"+props.cardData.email+"?cc=&subject=");
                                }} style={{display:'flex',justifyContent:'start',marginTop:'4px',marginRight:24}}>
                                    <img  src="./email.svg" alt="" />
                                    <div style={{color:'#253343',marginLeft:'8px',textDecoration:'underline',cursor:'pointer',fontSize:'12px',fontFamily:'Poppins-Regular'}}>{props.cardData.email}</div>
                                </div>
                                <div onClick={() => {
                                    window.open(props.cardData.linkedin)
                                }} style={{display:'flex',textDecoration:'underline',justifyContent:'start',marginTop:'4px',marginRight:24}}>
                                    <img src="./linkdin.svg" alt="" />
                                    <div style={{color:'#253343',marginLeft:'8px',cursor:'pointer',fontSize:'12px',fontFamily:'Poppins-Regular'}}>Linkedin</div>
                                </div>                                                                  
                                </div>
                            </div>
                        </div>
                    </div>                     */}
                    {/* <video autoPlay style={{borderRadius:'100%',width:'138px',height:'100%',border:'2px solid white'}} src="./images/01.mp4"></video> */}
                    {/* <img src="./images/user.png" style={{width:'138px',height:'138px',borderRadius:'100%'}} /> */}
                </div>                
            </div>
        </>
    )
}
export default CvProject