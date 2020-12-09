import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// WEBSOCKET CLIENT SIDE
const ws = (() => {
    // private
    // singleton instance
    let ws = undefined;
    let lazyUpdate = {};

    // public
    function createConnection(userId, callback) {
        destroyConnection();
        ws = new WebSocket("ws://localhost:3001?userId=" + userId);
        ws.addEventListener("message", ({ data: message }) => {
            let topicName = message.split(">>>")[0];
            if (lazyUpdate[topicName] > 0)
                lazyUpdate[topicName] -= 1;
            else
                callback();
        });
    }

    function destroyConnection() {
        if (ws)
            ws.close();
        ws = undefined;
    }

    function notifyChange(topicName) {
        ws.send(`${topicName}>>>changed`);
        lazyUpdate[topicName] = (lazyUpdate[topicName] | 0) + 1;
    }

    return {
        createConnection,
        destroyConnection,
        notifyChange
    }
})();

// API
async function getActiveUsers() {
    let response = await fetch('http://localhost:3001/active-users');
    response = await response.json();
    return response;
}

// HELPERS
function refreshConnection(e, userId, setActiveUsers) {
    if (e.charCode != 13)
        return;
    // when user press enter
    // renew connection with new userId
    ws.createConnection(userId,async ()=>{
        // load list of active users
        let activeUsers = await getActiveUsers();
        setActiveUsers(activeUsers);
    });
}

export default function DemoRealtime(props) {
    const [activeUsers, setActiveUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem("token");
         
        // if the user is not authorized, redirect to login page
        if (!token) { // TODO
            history.push('/signin');
            return;
        }

        (async () => {
            // load list of active users
            let activeUsers = await getActiveUsers();
            setActiveUsers(activeUsers);
        })();
    }, []);

    let listItems=[];
    for (let userId in activeUsers) {
        listItems.push(
            <li key={userId}>
                {userId}
            </li>
        );
    }

    return (
        <div>
            <p>User id:</p>
            <input
                type="text"
                onChange={e => setUserId(e.target.value)}
                onKeyPress={e => refreshConnection(e, userId, setActiveUsers)}
            ></input>
            <hr/>
            <p>Active users:</p>
            <ul>
                {listItems}
            </ul>
        </div>
    );
}