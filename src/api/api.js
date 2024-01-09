class Api {
  static baseUrl = 'https://codie-backend.azurewebsites.net/mobile';

  static async post(url, data) {
    const response = await fetch(this.baseUrl + url, {
      method: 'POST',
      mode: 'cors', // no-cors, *cors, same-origin
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + (localStorage.getItem('accessToken')),
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    });
    // console.log(response);
    return response.json();
  }
}
export default Api;
