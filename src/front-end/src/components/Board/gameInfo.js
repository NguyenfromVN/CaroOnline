import React from 'react';
import { Button } from '@material-ui/core';

const GameInfo = (props) => {
    const username = localStorage.getItem("username");
    const isPlayer = (username == props.board.userId1 || username == props.board.userId2);
    const winnerText = (props.board.winner ? props.board.winner : "not yet");
    const nextTurnChar = (props.board.nextTurn == props.board.userId1 ? 'X' : 'O');
    const nextTurnText = (isPlayer ? (username == props.board.nextTurn ? `you (${nextTurnChar})` : `opponent (${nextTurnChar})`) : `${props.board.nextTurn} (${nextTurnChar})`);

    return (
        <div className="game-info-frame">
            <div>Winner: {winnerText}</div>
            <div>Next turn: {props.board.winner ? '---' : nextTurnText}</div>
            <Button variant="outlined" color="secondary" style={{ margin: "5px 5px" }} disabled={!isPlayer || !!props.board.winner}>
                Surrender
            </Button>
        </div>
    );
}

export default GameInfo;