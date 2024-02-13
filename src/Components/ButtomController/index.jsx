/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { VoiceRecorder } from "symphony-ui"

const ButtomController = (props) => {
    useEffect(() => {

    })
    // const [isRecording,setIsRecording] =useState(false)
    return (
        <>
            <div className="w-full h-10 flex justify-between">
                <VoiceRecorder 
                isRecording={props.isRecording}
                isLoading={false}
                isTalking={false}
                onStart={() => props.onstart()}
                onStop={() => props.onstop()}
                onTalkingClick={() => {}}
                ></VoiceRecorder>
            </div>
        </>
    )
}
export default ButtomController