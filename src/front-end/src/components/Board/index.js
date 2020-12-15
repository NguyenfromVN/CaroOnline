import React from 'react';
import Square from './square';
import Chat from './chat';
import './index.css';

export default function Board(props) {
    const renderSquare = (i) => {
        // const winLine = props.winLine;
        return (
            <Square
            // value={props.squares[i]}
            // onClick={() => props.onClick(i)}
            // highlight={(winLine && winLine.includes(i))}
            />
        );
    }

    /*using 2 loops to create squares */
    const boardSize = 10;
    let squares = [];
    for (let i = 0; i < boardSize; i++) {
        let row = [];
        for (let j = 0; j < boardSize; j++) {
            row.push(renderSquare(i * boardSize + j));
        }
        squares.push(<div key={i} className="board-row">{row}</div>);
    }

    return (
        <div>
            <div className='board-game'>
                <div >
                    {squares}
                </div>

                <Chat />
            </div>

        </div>
    );
}