import React, { useEffect, useState } from 'react';
import api from '../../api/userApi';
import './index.css';

const Chat = (props) => {
    const [msg,setMsg]=useState("");
    const [listChat,setListChat]=useState(null);

    useEffect(()=>{
        (async()=>{
            let list=await getListChat();
            setListChat(list);
        })();
    },[]);

    async function getListChat(){
        let boardId=props.boardId;
        let chat=await api.getBoardChat(boardId);
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

    function sendMessage(){
        api.makeMessage(props.boardId,new Date().getTime(),msg);    
    }

    return (
        <div className='chat-frame'>
            <div className="list-chat">
                {listChat}
            </div>
            <div className='text-box'>
                <input 
                    className='message-text-box' 
                    onChange={(e)=>{
                        setMsg(e.target.value);
                    }}
                    type='text'
                />
                <button className='send-button' onClick={sendMessage}>SEND</button>
            </div>
        </div>
    );
}

export default Chat;