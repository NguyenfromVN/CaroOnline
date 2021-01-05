import React, { useEffect, useState } from 'react';
import './index.css';

function getRow(index, item) {
    return (
        <div key={item._id} style={{ display: 'flex' }}>
            <div style={{ width: '2em', textAlign: 'left', borderRight: '1px solid #dddddd', paddingTop: '10px' }}>
                {`${index + 1}`}
            </div>
            <div style={{ paddingLeft: '5px', paddingTop: '10px' }}>
                <b>{item.username}</b>
            </div>
            <div style={{ flexGrow: 1, borderRight: '1px solid #dddddd' }}></div>
            <div style={{ width: '2em', paddingTop: '10px' }}>
                {`${item.trophy || 0}`}
            </div>
            <div style={{ paddingTop: '10px' }}>
                🏆
            </div>
        </div>
    )
}

export default function RankingBoard(props) {
    function getList() {
        const list = props.rankingBoard;
        if (!list.length)
            return;
        const arr = [(
            <div key={-1}
                style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2em',
                    borderBottom: '1px solid #dddddd'
                }}
            >TOP 10 PLAYERS</div>
        )];
        list.forEach((item, index) => {
            arr.push(getRow(index, item));
        });
        return arr;
    }

    return (
        <div className='ranking-board'>
            {getList()}
        </div>
    );
}