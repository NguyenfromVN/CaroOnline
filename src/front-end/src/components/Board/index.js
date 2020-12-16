import React, { useEffect, useState } from 'react';
import Square from './square';
import Chat from './chat';
import './index.css';
import { useHistory } from 'react-router-dom';
import api from '../../api/userApi';
import { makeStyles } from '@material-ui/core/styles';

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
    const boardId = (new URL(document.location)).searchParams.get('boardId');
    const history = useHistory();
    const [squares, setSquares] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        (async () => {
            // get board
            const board = await api.getBoard(boardId);
            if (board.message == 'Unauthorized') {
                history.push('/signin');
                return;
            }
            console.log(board);
            setSquares(board.history[board.history.length - 1]);
            setBoard(board);
        })();
    }, []);

    function takeTurn(row, col){
        
    }

    function renderSquares(squares) {
        let jsx=[];
        for (let i=0; i<boardSize; i++) {
            let row=[];
            for (let j=0; j<boardSize; j++) {
                row.push(renderSquare({
                    value: squares[i*boardSize+j],
                    onClick: takeTurn(i,j)
                }));
            }
            jsx.push(<div key={i} className="board-row">{row}</div>);
        }
        return jsx;
    }

    return (
        <div>
            <div className='board-game'>
                <div>
                    {/* for history later */}
                </div>
                <div >
                    {renderSquares(squares)}
                </div>
                <Chat />
            </div>
        </div>
    );
}