import React, { useEffect, useState } from 'react';
import Square from './square';
import Chat from './chat';
import './index.css';
import { useHistory } from 'react-router-dom';
import api from '../../api/userApi';
import { makeStyles } from '@material-ui/core/styles';
import ws from '../../webSocketClient';

const useStyles = makeStyles((theme) => ({
    // icon: {
    //     marginRight: theme.spacing(2),
    // },
    // footer: {
    //     backgroundColor: theme.palette.background.paper,
    //     padding: theme.spacing(6),
    // },
    // breadCrumbsBlock: {
    //     display: 'flex',
    //     marginLeft: 700,
    // },
    // link: {
    //     display: 'flex',
    //     marginRight: 10,
    // },
    // iconForBreadSrum: {
    //     marginRight: theme.spacing(0.5),
    //     width: 20,
    //     height: 20,
    // },

}));

const boardSize = 3;

const renderSquare = (props) => {
    // const winLine = props.winLine;
    return (
        <Square
            value={props.value}
            onClick={props.onClick}
            // highlight={(winLine && winLine.includes(i))}
        />
    );
}

export default function Board(props) {
    const [board, setBoard] = useState({});
    const [chat, setChat] = useState([]);
    const boardId = (new URL(document.location)).searchParams.get('id');
    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        (async () => {
            // get board
            const board = await api.getBoard(boardId);
            if (board.message) {
                history.push('/signin');
                return;
            }
            setBoard(board);
            // get chat
            let chat=await api.getBoardChat(boardId);
            setChat(chat);
            // init web socket client
            ws.createConnection(localStorage.getItem('username'),(topicName)=>{
                let callbacks={
                    chat: async function(){
                        let newChat=await api.getBoardChat(boardId);
                        setChat(newChat);
                    },
                    board: async function(){
                        let board = await api.getBoard(boardId);
                        setBoard(board);
                    },
                    general: function(){
                        // TODO
                    }
                };
                let arr=topicName.split('>>>')[0];
                arr=arr.split('-');
                let topic=arr[arr.length-1];
                callbacks[topic]();
            });
            let topic=`${board.userId1}-${board.userId2}`;
            ws.subscribeTopic(`${topic}-board`);
            ws.subscribeTopic(`${topic}-chat`);
        })();
    }, []);

    async function takeTurn(row, col){
        await api.takeTurn(boardId,row,col);
        ws.notifyChange(`${board.userId1}-${board.userId2}-board`);
        let newBoard = await api.getBoard(boardId);
        setBoard(newBoard);
    }

    function renderSquares() {
        if (!board.boardId)
            return;
        let squares=board.history[board.history.length - 1].squares;
        let jsx=[];
        for (let i=0; i<boardSize; i++) {
            let row=[];
            for (let j=0; j<boardSize; j++) {
                row.push(renderSquare({
                    value: squares[i*boardSize+j],
                    onClick: ()=>takeTurn(i,j)
                }));
            }
            jsx.push(<div key={i} className="board-row">{row}</div>);
        }
        return jsx;
    }

    // scroll to the bottom of chat frame
    setTimeout(()=>{
        let element = document.getElementById("listChat");
        element.scrollTop = element.scrollHeight;
    },0);

    return (
        <div>
            <div className='board-game'>
                <div>
                    {/* for history */}
                </div>
                <div >
                    {renderSquares()}
                </div>
                <Chat boardId={boardId} chat={chat} topicName={`${board.userId1}-${board.userId2}-chat`}/>
            </div>
        </div>
    );
}