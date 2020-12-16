import React from "react";
import './index.css';

const Chat = () => {

    return (
        <div className='chat-frame'>
            <div>
                {/* list of message */}
            </div>
            <div className='text-box'>
                <input className='message-text-box' type='text'/>
                <button className='send-button'>SEND</button>
            </div>
        </div>
    );
}

export default Chat;