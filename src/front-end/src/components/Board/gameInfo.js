import React, { useEffect, useState } from 'react';
import ws from '../../webSocketClient';
import { Button } from '@material-ui/core';
import api from '../../api/userApi';

const time = 61000; // time for each turn, 61 seconds

function getTimer(countdown) {
    if (countdown >= 10) {
        return `${countdown} s`;
    }
    if (countdown > 0) {
        return `0${countdown} s`;
    }
    return countdown;
}

function Countdown(props) {
    const [countdown, setCountdown] = useState('---');
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        // clear interval
        clearInterval(intervalId);
        // update countdown
        if (props.board.boardId) {
            if (props.board.winner) {
                setCountdown('Finished');
            } else if (props.board.lastTurn) {
                let id = setInterval(() => {
                    const newCountdown = ((time - (new Date().getTime() - props.board.lastTurn)) / 1000).toFixed(0);
                    if (newCountdown == 0) {
                        // out of time
                        (async () => {
                            const username = localStorage.getItem("username");
                            if (props.isPlayer && props.board.nextTurn != username) {
                                await api.forceWin(props.board.boardId);
                                ws.notifyChange(`${props.board.boardId}-board`, `Out of time! ${props.board.nextTurn} lost!`);
                            }
                        })();
                        // clear interval
                        clearInterval(intervalId);
                        setCountdown('Time is over!');
                    } else {
                        setCountdown(newCountdown);
                    }
                }, 1000);
                setIntervalId(id);
            } else {
                setCountdown('Not start yet!');
            }
        }

        return (()=>clearInterval(intervalId));
    }, [props.board]);

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

    function drawRequestHandler(){
        ws.notifyChange(`${props.board.boardId}-board`, `${username} requested for a draw!`);
    }

    return (
        <div className="game-info-frame">
            <div>Winner: {winnerText}</div>
            <div>Next turn: {props.board.winner ? '---' : nextTurnText}</div>
            <Button onClick={drawRequestHandler} variant="outlined" color="primary" style={{ margin: "5px 5px" }} disabled={!isPlayer || !!props.board.winner}>
                Draw request
            </Button>
            <Button onClick={handleSurrender} variant="outlined" color="secondary" style={{ margin: "5px 5px" }} disabled={!isPlayer || !!props.board.winner}>
                Surrender
            </Button>
            <Countdown board={props.board} isPlayer={isPlayer} />
        </div>
    );
}

export default GameInfo;