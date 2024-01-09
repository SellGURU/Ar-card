/* eslint-disable react/prop-types */
import { VoiceRecorder } from "symphony-ui"

const ButtomController = (props) => {
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