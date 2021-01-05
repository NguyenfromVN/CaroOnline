import React, { useEffect, useState } from 'react';

const GameInfo = (props) => {
    const username = localStorage.getItem("username");
    const isPlayer = (username == props.board.userId1 || username == props.board.userId2);
    const winnerText = (props.board.winner ? props.board.winner : "not yet");
    const nextTurnChar = (props.board.nextTurn == props.board.userId1 ? 'X' : 'O');
    const nextTurnText = (isPlayer ? (username==props.board.nextTurn ? `you (${nextTurnChar})` : `opponent (${nextTurnChar})`) : `${props.board.nextTurn} (${nextTurnChar})`);
    
    return (
        <div className="game-info-frame">
            <div>Winner: {winnerText}</div>
            <div>Next turn: {nextTurnText}</div>
        </div>
    );
}

export default GameInfo;