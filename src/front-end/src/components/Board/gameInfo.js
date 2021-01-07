import React from 'react';
import { Button } from '@material-ui/core';
import api from '../../api/userApi';

const GameInfo = (props) => {
    const username = localStorage.getItem("username");
    const boardId = props.board.boardId;
    const isPlayer = (username == props.board.userId1 || username == props.board.userId2);
    const winnerText = (props.board.winner ? props.board.winner : "not yet");
    const nextTurnChar = (props.board.nextTurn == props.board.userId1 ? 'X' : 'O');
    const nextTurnText = (isPlayer ? (username == props.board.nextTurn ? `you (${nextTurnChar})` : `opponent (${nextTurnChar})`) : `${props.board.nextTurn} (${nextTurnChar})`);

    const handleSurrender = async () => {
        const res = await api.surrender(boardId);
        // api này trả về 1 trường duy nhất là winner -> cách lấy: res.winner
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
        </div>
    );
}

export default GameInfo;