import { toast } from "react-toastify";
import Api from "./api";

class Resume extends Api {
    static getAll(submit){
        this.post('/get_cv_json',undefined).then(res => {
            submit(res)
        })
    }
    static addResume(jsonData,submit){
        this.post('/add_cv_json',jsonData).then(res => {
            submit(res)
        })        
    }
    static delete(id,submit){
        this.post('/delete_cv_json',{id:id}).then(res => {
            submit(res)
        })        
    }    
    static update(data,submit,oncatch){
        this.post('/edit_cv_json',data).then(res => {
            submit(res)
        }).catch(err => {
            toast.success(err)
            oncatch()
        })        
    }       
}   
export default Resume