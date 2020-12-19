import React, { useEffect, useState } from 'react';
import api from '../../api/userApi';
import './index.css';
import ws from '../../webSocketClient';

const Chat = (props) => {
    const [msg,setMsg]=useState("");

    function getListChat(){
        let chat=props.chat;
        let jsx=[];
        let username=localStorage.getItem('username');
        for (let i=0; i<chat.length; i++){
            if (chat[i].from==username){
                jsx.push(
                    <div key={chat[i].time} className='message-tag-right'>
                        <div></div>
                        <div 
                            style={{
                                backgroundColor: "#cccccc", 
                                borderRadius: "5px",
                                margin: "10px",
                                boxSizing: "border-box",
                                textAlign: "left",
                                padding: "10px"
                            }}>
                            {chat[i].content}
                        </div>
                    </div>
                );
            } else {
                jsx.push(
                    <div key={chat[i].time} className='message-tag-left'>
                        <div
                            style={{
                                backgroundColor: "#cccccc", 
                                borderRadius: "5px",
                                margin: "10px",
                                boxSizing: "border-box",
                                textAlign: "left",
                                padding: "10px"
                            }}
                        >
                            {chat[i].content}
                        </div>
                    </div>
                );
            }
        }
        return jsx;
    }   
    
    let listChat=getListChat();

    async function sendMessage(){
        await api.makeMessage(props.boardId,new Date().getTime(),msg); 
        ws.notifyChange(props.topicName);
        setMsg('');
    }

    return (
        <div className='chat-frame'>
            <div className="list-chat" id='listChat'>
                {listChat}
            </div>
            <div className='text-box'>
                <input 
                    className='message-text-box' 
                    onChange={(e)=>{
                        setMsg(e.target.value);
                    }}
                    onKeyPress={(e)=>{
                        if ((e.code || e.key)=='Enter'){
                            // ENTER is pressed
                            sendMessage();
                        }
                    }}
                    type='text'
                    value={msg}
                />
                <button className='send-button' onClick={sendMessage}>SEND</button>
            </div>
        </div>
    );
}

export default Chat;