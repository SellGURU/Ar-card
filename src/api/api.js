import axios from "axios";

class Api {
  static baseUrl = "https://vercel-avatalk-six.vercel.app/avatalk";

  static async post(url, data) {
    const response = await fetch(this.baseUrl + url, {
      method: "POST",
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    });
    // console.log(response);
    return response.json();
  }

  static async get(url){
    const response = axios.get('https://vercel-avatalk-six.vercel.app/avatalk'+url);
    return response;    

  }
}
export default Api;
