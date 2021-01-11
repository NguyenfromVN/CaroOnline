import React, { useEffect, useState } from 'react';
import ws from '../../webSocketClient';
import { Button } from '@material-ui/core';
import api from '../../api/userApi';

const time = 21000; // time for each turn, 21 seconds

function getTimer(countdown) {
    if (countdown >= 10) {
        return `${countdown} s`;
    }
    if (countdown > 0) {
        return `0${countdown} s`;
    }
    return countdown;
}

let prevBoard = {};
let intervalIdRef = null;

function Countdown(props) {
    const [countdown, setCountdown] = useState('---');
    const [intervalId, setIntervalId] = useState(null);
    intervalIdRef = intervalId;

    useEffect(() => clearInterval(intervalIdRef), []);

    function updateCountdown(val) {
        setTimeout(() => setCountdown(val));
    }

    function updateIntervalId(val) {
        setTimeout(() => setIntervalId(val));
    }

    // check for props.board change
    if (prevBoard != props.board) {
        clearInterval(intervalIdRef);
        // update prevBoard
        prevBoard = props.board;
        // update countdown
        if (props.board.boardId) {
            if (props.board.winner) {
                updateCountdown('Finished');
            } else if (props.board.lastTurn) {
                let id = setInterval(() => {
                    const newCountdown = ((time - (new Date().getTime() - props.board.lastTurn)) / 1000).toFixed(0);
                    if (newCountdown == 0) {
                        // out of time
                        (async () => {
                            const username = localStorage.getItem("username");
                            if (props.board.nextTurn != username) {
                                // await api.forceWin(props.board.boardId);
                                // ws.notifyChange(`${props.board.boardId}-board`, `Out of time! ${props.board.nextTurn} lost!`);
                            }
                        })();
                        // clear interval
                        clearInterval(intervalIdRef);
                        updateCountdown('Time is over!');
                    } else {
                        updateCountdown(newCountdown);
                    }
                }, 1000);
                updateIntervalId(id);
            } else {
                updateCountdown('Not start yet!');
            }
        }
    }

    return (<div>{getTimer(countdown)}</div>);
}

const GameInfo = (props) => {
    const username = localStorage.getItem("username");
    const boardId = props.board.boardId;
    const isPlayer = (username == props.board.userId1 || username == props.board.userId2);
    const winnerText = (props.board.winner ? props.board.winner : "not yet");
    const nextTurnChar = (props.board.nextTurn == props.board.userId1 ? 'X' : 'O');
    const nextTurnText = (isPlayer ? (username == props.board.nextTurn ? `you (${nextTurnChar})` : `opponent (${nextTurnChar})`) : `${props.board.nextTurn} (${nextTurnChar})`);

    const handleSurrender = async () => {
        const res = await api.surrender(boardId);
        ws.notifyChange(`${props.board.boardId}-board`, `${username} surrendered!`);
    }

    return (
        <div className="game-info-frame">
            <div>Winner: {winnerText}</div>
            <div>Next turn: {props.board.winner ? '---' : nextTurnText}</div>
            <Button variant="outlined" color="primary" style={{ margin: "5px 5px" }} disabled={!isPlayer || !!props.board.winner}>
                Draw request
            </Button>
            <Button onClick={handleSurrender} variant="outlined" color="secondary" style={{ margin: "5px 5px" }} disabled={!isPlayer || !!props.board.winner}>
                Surrender
            </Button>
            <Countdown board={props.board} />
        </div>
    );
}

export default GameInfo;