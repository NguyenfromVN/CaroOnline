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
    },
    getAllBoards: async ()=>{
        const url = '/board/get_all_boards';
        const response = await axiosClient.get(url);
        return response;
    },
    getBoard: async function(boardId){
        let boards=await this.getAllBoards();
        for (let i=0; i<boards.length; i++){
            if (boards.boardId==boardId)
                return boards[i];
        }
    }
}

export default userApi;