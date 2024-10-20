import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../store/app"
import { useSearchParams } from "react-router-dom";
function getDaysBetweenDates(date1) {
    // Convert the input strings to Date objects
    const firstDate = new Date();
    const secondDate = new Date(date1);
    
    // Calculate the time difference in milliseconds
    const timeDifference = secondDate - firstDate; // Difference in milliseconds
    
    // Convert milliseconds to days (1000 ms/s * 60 s/min * 60 min/h * 24 h/day)
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    
    // Return the difference in days
    return Math.ceil(timeDifference / millisecondsInADay);
}

const AccesNotif = () => {
    const appContext = useContext(AppContext)
    const [showNotif,setShowNotif] = useState(false)
    const [searchParams] = useSearchParams();
    
    // console.log(searchParams.get("view"))
    useEffect(() => {
        if(resolveText()!= undefined){
            setShowNotif(true)
        }
        console.log(resolveText())
    },[appContext.userAccount.type])

    const resolveText = () => {
        if((appContext.userAccount.type == 'trial' || appContext.userAccount.type == 'free') && searchParams.get("view") =='review'){
           return "Upgrade to Pro"
            // return " Unlock voice chat with your Avatar! Upgrade to Pro and make your Al persona even more interactive and engaging."
        }        
        if(appContext.userAccount.type == 'pro'){
            if(getDaysBetweenDates(appContext.userAccount.end_of_date) <=7 && searchParams.get("view") =='review'){
                return 'AR features will be limited soon. Renew to  allow your followers experience cutting-edge technology.'
            }
        }
        if(searchParams.get("view") !='review'){
            return "Impressed by what you heard? Imagine your voice here. Start your free Avatalk trial today!"

        }

    }
    return (
        <>
        {showNotif &&
            <div className="w-full  flex justify-center">
                {resolveText() =='Upgrade to Pro' ?
                    <div onClick={() => {
                        window.open("https://portal.avatalk.me/#/settings/service")
                    }} className="bg-primary-color w-[140px] h-[40px] text-white flex justify-center items-center rounded-[27px] cursor-pointer">{'Upgrade to Pro'}</div>
                :
                    <div className="w-full max-w-[366px] rounded-[27px] p-4 px-7 text-justify bg-white border border-[#6432C9]">
                        <div className="text-[#374151] text-[14px]">
                            {resolveText()}
                        </div>
                        <div className="w-full flex gap-6 justify-end mt-2">
                            <div onClick={() => {
                                window.open("https://portal.avatalk.me/#/settings/service")
                            }} className="text-[#FBBF24] cursor-pointer text-[14px] font-medium">{appContext.userAccount.type == 'pro'?'Renew Your Plan':'Create Your Avatalk'}</div>
                            <div onClick={() => {
                                setShowNotif(false)
                            }} className="text-[#94A3B8] cursor-pointer text-[14px] font-medium">Skip Now</div>
                        </div>
                    </div>
                }
            </div>
        }
        </>
    )
}

export default AccesNotif