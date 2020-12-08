import axiosClient from "./axiosClient";

const userApi = {
    login: (username, password) => {
        const url = '/login';
        axiosClient.post(url, {
            username: username,
            password: password
        })
            .then(function (response) {
                console.log(response);
            })
    }
}

export default userApi;