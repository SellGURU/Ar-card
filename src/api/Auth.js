import Api from "./api";

class Auth extends Api {
    static getProfile(userId,action) {
        this.get('/presentation_info/user='+userId).then((res) => {
            action(res.data)
        })
    }
}

export default Auth