import Api from "./api";

class Flow extends Api {
    static async chat(data) {
        let response = await fetch(
        'https://vercel-avatalk-six.vercel.app/avatalk/flow',
        {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Credentials': 'true',
            // 'Access-Control-Allow-Origin': '*',
            // Authorization:
            //     'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMTFiN2I5MjlhIiwiaWF0IjoxNzA3MDIzMTY5LCJuYmYiOjE3MDcwMjMxNjksImp0aSI6Ijk0ZTlkNzA4LWZiNzYtNGJkOS1hZTA0LTliNmE5MzU4MmQzZiIsImV4cCI6MTcxNzM5MTE2OSwidHlwZSI6ImFjY2VzcyIsImZyZXNoIjpmYWxzZX0.KIaBTQR8MuWXPaPrm7R2-8QWuljT4r7ovo7bVMkYOrc',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data),
        },
        );
        return response.json();
    }
}

export default Flow;