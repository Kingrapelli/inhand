import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RequestType from './Enums/RequestType';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const exceptionalkeywords = ['hi','dear'];

  useEffect(()=>{
    setMessages([...messages, { sender: 'bot', text: 'Hi Dear, I am here to assist you!' }]);
  },[]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    console.log(input);
    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    console.log(userMessage);
    try {
      let action = [];
      let message = userMessage.text.split(" ");
      console.log(message);

      message.forEach(item=>{
        RequestType.forEach(type=>{
          let tags = type.hashtags && type.hashtags.split(",");
          if(tags && tags.length){
            tags.forEach(tag=> {
              if(tag.toLowerCase().includes(item.toLowerCase())){
                action.push(type);
                console.log("matched")
              }
            })
          }
        });
      })
      if(action.length == 0)
        setMessages([...messages,userMessage, { sender: 'bot', text: 'Sorry, Not found anything.' }]);
      else{
        console.log(action);
        console.log(action[0].endpoint);
        if(action[0].endpoint){
          const req = await fetch(`http://localhost:5000/${action[0].endpoint}`);
          const res = await req.json();
          if(res.length > 0){
            console.log(res);
            let checkingdatabase = [];
            message.forEach(m=>{
              res.forEach(item=>{
                if(item.name.toLowerCase().includes(m.toLowerCase())){
                  checkingdatabase.push(item);
                }
              })
            });
            console.log(checkingdatabase);
            if(checkingdatabase.length){
              let _text = 'data matched in below records';
              checkingdatabase.forEach(item=>{
                _text = _text + " " + item.name + ",";
              })
              setMessages([...messages,userMessage, { sender: 'bot', text: _text }]);
            }else{
              setMessages([...messages,userMessage, { sender: 'bot', text: `Sorry, Specific records not found in database. Please navigate to ${action[0].name}` }]);
            }
          }else{
            setMessages([...messages,userMessage, { sender: 'bot', text: `Data not available in ${action[0].name} Database` }]);
          }
        }
      }
      // const botMessage = { sender: 'bot', text: 'Hi' };
      // setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages,userMessage, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
    setInput('');
  };

  return (
    <div>
      <div className="chat-window">
        {messages && messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatbot;
