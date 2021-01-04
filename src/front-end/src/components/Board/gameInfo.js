import React, { useEffect, useState } from 'react';

const GameInfo = (props) => {
    let username = localStorage.getItem("username");
    let winnerText = (props.board.winner) ? props.board.winner : "None";
    let nextTurnText = (props.board.nextTurn == username) ? "You" : "Opponent";
    let nextTurnChar = (username == props.board.userId1) ? "X" : "O";
    let isPlayer = (username == props.board.userId1 || username == props.board.userId2);
    let infoClassName = (isPlayer) ? "game-info-frame" : "game-info-frame-display-none"

    return (
        <div className={infoClassName}>
            <h1>Winner: {winnerText}</h1>
            <h1>Next turn: {nextTurnText}</h1>
            <h1>{nextTurnChar}</h1>
        </div>
    );
}

export default GameInfo;