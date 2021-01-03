import React, { useEffect, useState } from 'react';
import Square from './square';
import Chat from './chat';
import './index.css';
import { useHistory } from 'react-router-dom';
import api from '../../api/userApi';
import { makeStyles } from '@material-ui/core/styles';
import ws from '../../webSocketClient';

const useStyles = makeStyles((theme) => ({
}));

const boardSize = 20;

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
    const [isPlayer, setIsPlayer] = useState(false);
    const [isEmptyRoom, setIsEmptyRoom] = useState(false);
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
            // init web socket client
            ws.createConnection(localStorage.getItem('username'), (topicName) => {
                let callbacks = {
                    chat: async function () {
                        let newChat = await api.getBoardChat(boardId);
                        setChat(newChat);
                    },
                    board: async function () {
                        let board = await api.getBoard(boardId);
                        setBoard(board);
                    },
                };
                let arr = topicName.split('>>>')[0];
                arr = arr.split('-');
                let topic = arr[arr.length - 1];
                if (callbacks[topic]) {
                    callbacks[topic]();
                } else {
                    // players topic
                    const activePlayers=topic[topic.length - 1];
                    if (activePlayers!=2){
                        alert('The game will start when another player is available, wait for it!');
                        setIsEmptyRoom(true);
                    } else {
                        alert('Another player is ready, are you ready?');
                        setIsEmptyRoom(false);
                    }
                }
            });
            ws.subscribeTopic(`${board.boardId}-board`);
            ws.subscribeTopic(`${board.boardId}-chat`);
            // set isPlayer
            let username = localStorage.getItem('username');
            const isPlayer = (username == board.userId1 || username == board.userId2);
            setIsPlayer(isPlayer);
            if (isPlayer){
                ws.subscribeTopic(`${board.boardId}-players`);    
            }
            // get chat
            let chat = await api.getBoardChat(boardId);
            setChat(chat);
        })();
    }, []);

    async function takeTurn(row, col) {
        if (!isPlayer) {
            return;
        }
        if (isEmptyRoom) {
            alert("Please wait until there is another player enter this room to play!")
            return;
        }
        // check if the cell is empty
        if (board.history[board.history.length - 1].squares[boardSize * row + col]) {
            return;
        }
        // check if this is your turn or not
        if (board.nextTurn != localStorage.getItem('username')) {
            return;
        }
        // make the turn at client while waiting for response from server
        let boardCopy = JSON.parse(JSON.stringify(board));
        let current = JSON.parse(JSON.stringify(board.history[board.history.length - 1]));
        boardCopy.history.push(current);
        current.squares[row * boardSize + col] = (board.userId1 == localStorage.getItem('username') ? 'X' : 'O');
        setBoard(boardCopy);
        await api.takeTurn(boardId, row, col);
        ws.notifyChange(`${board.boardId}-board`);
    }

    function renderSquares() {
        if (!board.boardId)
            return;
        let squares = board.history[board.history.length - 1].squares;
        let jsx = [];
        for (let i = 0; i < boardSize; i++) {
            let row = [];
            for (let j = 0; j < boardSize; j++) {
                row.push(renderSquare({
                    value: squares[i * boardSize + j],
                    onClick: () => takeTurn(i, j)
                }));
            }
            jsx.push(<div key={i} className="board-row">{row}</div>);
        }
        return jsx;
    }

    // scroll to the bottom of chat frame
    setTimeout(() => {
        let element = document.getElementById("listChat");
        element.scrollTop = element.scrollHeight;
    }, 0);

    return (
        <div>
            <div className='board-game'>
                <div>
                    {/* for history */}
                </div>
                <div >
                    {renderSquares()}
                </div>
                <Chat
                    boardId={boardId}
                    participant1={board.userId1}
                    participant2={board.userId2}
                    isPlayer={isPlayer}
                    chat={chat}
                    topicName={`${board.boardId}-chat`}
                />
            </div>
        </div>
    );
}