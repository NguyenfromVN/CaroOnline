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
        const url = '/board/get_board/' + boardId;
        let response;
        try {
            response = await axiosClient.get(url);
        } catch (e) {
            response = e.response.data;
        }
        return response;
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
    getUserByUsername: async function (username) {
        const url = `/user/${username}`;
        const response = await axiosClient.get(url);
        return response;
    },
    getRankingBoard: async function () {
        const url = '/get_leaderboard';
        const response = await axiosClient.get(url);
        return response;
    },
    surrender: async function (boardId) {
        const url = `/board/surrender?boardId=${boardId}`;
        const response = await axiosClient.get(url);
        return response;
    },
    forceWin: async function (boardId) {
        const url = `/board/force_win?boardId=${boardId}`;
        const response = await axiosClient.get(url);
        return response;
    },
    changePassword: async function (email) {
        const url = "/change_password";
        const response = await axiosClient.post(url,
            {
                email: email
            });
        return response;
    },
    updatePassword: async function (email, password) {
        const url = "/update_password";
        const response = await axiosClient.post(url,
            {
                email: email,
                password: password,
            });
        return response;
    },
    drawGame: async function (boardId) {
        const url = "/board/draw_game?boardId="+boardId;
        const response = await axiosClient.get(url);
        return response;
    },
    fastPlay: async function () {
        const url = "/board/fast_play";
        const response = await axiosClient.get(url);
        return response;
    },
    //API for Admin
    searchUsers: async function (username, keyword) {
        const url = `/admin/search_user?keyword=${keyword}`;
        const response = await axiosClient.get(url);
        return response;
    },
    blockUser: async function (username) {
        const url = `/admin/block_user?username=${username}`;
        const response = await axiosClient.get(url);
        return response;
    },
}

export default userApi;