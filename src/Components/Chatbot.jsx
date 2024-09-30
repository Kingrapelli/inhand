import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RequestType from './Enums/RequestType';
import Locations from './Enums/LocationEnum';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const exceptionalkeywords = ['hi','dear','is','a','an','please','kindly','are','in', 'travels', 'travel', 'I', 'am'];

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
      let message = userMessage.text.split(" ").map(item=>{
        return {name : item, status : false}
      });
      console.log(message);


      if(message.length == 1){
        const validate = exceptionalkeywords.filter(item=> {
          return item.toLowerCase() === message[0].name.toLowerCase()
        });
        console.log(validate);
        if(validate){
          setMessages([...messages,userMessage, { sender: 'bot', text: `<a href="" onClick={navigate("/")}>click here</>` }]);
          // setMessages([...messages,userMessage, { sender: 'bot', text: 'Hi Dear, I am here to assist you!' }]);
          setInput('');
          return
        }
      }
      message.forEach(item=>{
        RequestType.forEach(type=>{
          let tags = type.hashtags && type.hashtags.split(",");
          if(tags && tags.length){
            tags.forEach(tag=> {
              if(!exceptionalkeywords.find(keyword=> keyword == item.name)){
                if(tag.toLowerCase() === item.name.toLowerCase() && item.status == false){
                  item.status = true;
                  action.push(type);
                  console.log("matched")
                }
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
                if(!exceptionalkeywords.find(keyword=> keyword == m.name)){
                  if(item.name.toLowerCase().includes(m.name.toLowerCase()) && m.status == false){
                    // m.status = true;
                    checkingdatabase.push(item);
                  }
                }
              })
            });
            let locationFound ;
            let validatelocations = message.filter(m=> m.status == false);
            validatelocations.forEach(loca=>{
              Locations.forEach(location => {
                if(location.name.toLowerCase().includes(loca.name.toLowerCase())){
                  locationFound = location.value;
                }
              })
            })
            if(checkingdatabase.length == 1){
              setMessages([...messages,userMessage, { sender: 'bot', text: `Result found in ${checkingdatabase[0].name} ${getLocationNameById(checkingdatabase[0].location)}` }]);
            }
            else if(checkingdatabase.length > 1){
              if(locationFound){
                let _checkingdatabase = checkingdatabase.filter(item=> item.location == locationFound);
                let _text = 'data matched in below records';
                _checkingdatabase.forEach(item=>{
                  _text = _text + " " + item.name + " " + getLocationNameById(item.location) + ",";
                })
                setMessages([...messages,userMessage, { sender: 'bot', text: _text }]);
              }else{
                setMessages([...messages,userMessage, { sender: 'bot', text: "Kindly search with location again" }]);
              }
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

  function getLocationNameById (id) {
    let location = Locations && Locations.filter(item => item.value == id);
    return location[0].name;
  }

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
