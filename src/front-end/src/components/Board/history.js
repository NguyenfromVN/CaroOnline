import React from 'react';
import './index.css';
import { Button } from '@material-ui/core';

function GameHistory(props) {
    const handleClick = (num) => {
        props.setStepNum(num);
    }

    function getListHistory() {
        const board = props.board;
        let historyList = board.history;
        let jsx = [];
        if (!historyList) {
            return jsx;
        }
        for (let i = 0; i < historyList.length; i++) {
            if (i == 0) {
                jsx.push(
                    <Button variant="outlined" color={props.stepNum == i ? "secondary" : "primary"} onClick={() => handleClick(i)}
                        style={{
                            width: '70%',
                            margin: "5px",
                            fontWeight: props.stepNum == i ? "bold" : "normal",
                        }}
                        disabled={!board.winner} //disable khi game đấu chưa kết thúc
                    >
                        Start
                    </Button>
                )
            } else {
                jsx.push(
                    <Button variant="outlined" color={props.stepNum == i ? "secondary" : "primary"} onClick={() => handleClick(i)}
                        style={{
                            width: '70%',
                            margin: "5px",
                            fontWeight: props.stepNum == i ? "bold" : "normal",
                        }}
                        disabled={!board.winner} //disable khi game đấu chưa kết thúc
                    >
                        {i}
                    </Button>
                )
            }
        }

        return jsx;
    }

    const listHistory = getListHistory();

    return (
        <div className="history-frame">
            <div className="list-history">
                {listHistory}
            </div>
        </div>
    );
}

export default GameHistory;