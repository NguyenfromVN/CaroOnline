import axiosClient from "./axiosClient";
import axios from 'axios';

const userApi = {
    login: async (username, password) => {
        let response;
        try {
            response = await axios.post('http://localhost:3001/login', {
                username: username,
                password: password
            })
        } catch (e) {
            response = e.response.data;
        }
        return response;
    },
    register: async (email, username, password) => {
        const url = '/register';
        const response = await axiosClient.post(url, {
            email: email,
            username: username,
            password: password
        });
        return response;
    },
    validate: async (username) => {
        const url = `/validate/${username}`;
        const response = await axiosClient.post(url);
        return response;
    },
    getAllBoards: async () => {
        const url = '/board/get_all_boards';
        let response;
        try {
            response = await axiosClient.get(url);
        } catch (e) {
            response = e.response.data;
        }
        return response;
    },
    getBoard: async function (boardId) {
        let boards = await this.getAllBoards();
        if (boards.message) {
            return boards;
        }
        for (let i = 0; i < boards.length; i++) {
            if (boards[i].boardId == boardId)
                return boards[i];
        }
    },
    takeTurn: async function (boardId, row, col) {
        const url = `/board/make_turn?boardId=${boardId}&row=${row}&col=${col}`;
        const response = await axiosClient.get(url);
        return response;
    },
    joinBoard: async function (boardId) {
        const url = '/board/join_board?boardId=' + boardId;
        const response = await axiosClient.get(url);
        return response;
    },
    createBoard: async function (boardId, name) {
        const url = '/board/create_board?boardId=' + boardId + '&name=' + name;
        const response = await axiosClient.get(url);
        return response;
    },
    getBoardChat: async function (boardId) {
        const url = '/board/get_board_chat?boardId=' + boardId;
        const response = await axiosClient.get(url);
        return response;
    },
    makeMessage: async function (boardId, time, content) {
        const url = '/board/make_message?boardId=' + boardId + '&time=' + time + '&content=' + content;
        const response = await axiosClient.get(url);
        return response;
    },
    getUsers: async function () {
        const url = '/users';
        const response = await axiosClient.get(url);
        return response;
    },
    getOneUser: async function (username) {
        let users = await this.getUsers();
        if (users.message) {
            return users;
        }
        for (let i = 0; i < users.length; i++) {
            if (users[i].username == username)
                return users[i];
        }
    }
}

export default userApi;