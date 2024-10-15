import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RequestType from './Enums/RequestType';
import Locations from './Enums/LocationEnum';
import { validateExistingUser } from './Utilities/TimeAgo';

const Chatbot = () => {
  let token = (localStorage.getItem('token'));

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const exceptionalkeywords = ['hi','dear','is','a','an','please','kindly','are','in', 'travels', 'travel', 'I', 'am'];
  const helpkeywords = ['help','help me','assist','assist me','how can you help me','how can you assist me',];
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [userlist, setUserList] = useState([{type: 'fullname',data: false},{type: 'email',data: false},
    {type: 'password' ,data: false},{type: 'confirmation',data: false}]);

  useEffect(()=>{
    setMessages([...messages, { sender: 'bot', text: 'Hi Dear, I am here to assist you!' }]);
  },[]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      let action = [];
      let message = userMessage.text.split(" ").map(item=>{
        return {name : item, status : false}
      });
      const findContinues = messages && messages.filter( item => item.sender == 'bot' && item.continue == true);

      if(findContinues.length > 0 && (messages[messages.length - 1].sender == 'bot' && messages[messages.length - 1].continue)){
        if(findContinues[0].text.toLowerCase().includes('user')){
            for(const index in userlist){

              if(userlist[index].data == false){
                new Promise(resolve=>{
                  setMessages([...messages,userMessage, { sender: 'bot', text: `Please enter ${userlist[index].type}`, continue : true}]);
                  resolve(true);
                })
                const updatedUserList = userlist.map((user, i) => 
                  (i === Number(index)) ? { ...user, data: true } : user
                );

                setUserList(updatedUserList);
                setInput('');
                return 
              }

              if(findContinues[findContinues.length - 1].text.includes(userlist[index].type)){
                if(userlist[index].type == 'fullname' && userlist[index].data == true && !fullname){
                  setFullName(userMessage.text);
                  setInput('');
                }
                if(userlist[index].type == 'email' && userlist[index].data == true && !email){
                  setEmail(userMessage.text);
                  setInput('');
                }
                if(userlist[index].type == 'password' && userlist[index].data == true && !password){
                  setPassword(userMessage.text);
                  setInput('');
                }
                if(userlist[index].type == 'confirmation' && userlist[index].data == true ){
                  if((userMessage.text == 'true' || userMessage.text == 'yes' || userMessage.text == 'ok' || userMessage.text == 'okay')){
                    const userdata = {
                      name : fullname,
                      email : email,
                      password : password,
                      city : '',
                      path : ''
                    }
                    const validatinguser = await validateExistingUser(userdata);
                    if(validatinguser){
                      setMessages([...messages,userMessage, { sender: 'bot', text: `Email Already exists` }]);
                      setFullName('');
                      setEmail('');
                      setPassword('');
                      setInput('');
                      return 
                    }
                    const res = fetch('http://localhost:5000/users', {
                        method: 'POST',
                        headers: {
                            "Content-Type" : 'application/json'
                        },
                        body: JSON.stringify(userdata)
                    }).then(async ()=>{
                      setMessages([...messages,userMessage, { sender: 'bot', text: `User got created` }]);
                      setFullName('');
                      setEmail('');
                      setPassword('');
                      setInput('');
                      return 
                    }).catch(error=>{
                      setMessages([...messages,userMessage, { sender: 'bot', text: `Error while creating user` }]);
                      setFullName('');
                      setEmail('');
                      setPassword('');
                      setInput('');
                      return 
                    });
                  }
                  else if(userMessage.text.includes('no') || userMessage.text.includes('canc')){
                    setMessages([...messages,userMessage, { sender: 'bot', text: `Cancelled creating user`, continue : false }]);
                    setFullName('');
                    setEmail('');
                    setPassword('');
                    setInput('');
                    return 
                  }
                }
              }
            }
        }
        setInput('');
        return 
      }
      if(helpkeywords.find(item=> item == userMessage.text)){
        setMessages([...messages,userMessage, { sender: 'bot', text: `I can help you to find bookings, food, restarants and Creating User` }]);
        setInput('');
        return 
      }
      if(!token){
        setMessages([...messages,userMessage, { sender: 'bot', text: `I can't assist you right now. Kindly login to avail me. Thank you.` }]);
        setInput('');
        return 
      }

      if(message.length == 1){
        const validate = exceptionalkeywords.filter(item=> {
          return item.toLowerCase() === message[0].name.toLowerCase()
        });
        console.log(validate);
        if(validate){
          // setMessages([...messages,userMessage, { sender: 'bot', text: `<a href="" onClick={navigate("/")}>click here</>` }]);
          setMessages([...messages,userMessage, { sender: 'bot', text: 'Hi Dear, I am here to assist you!' }]);
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
                }
              }
            })
          }
        });
      })
      if(action.length == 0)
        setMessages([...messages,userMessage, { sender: 'bot', text: 'Sorry, Not found anything.' }]);
      else{
        if(action && action[0] && action[0].endpoint){
          const req = await fetch(`http://localhost:5000/${action[0].endpoint}`);
          const res = await req.json();
          if(res.length > 0){
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
        }else{
          if(action[0].actiontype == 'new'){
            if(message.find(m=> m.name == 'user')){
              setMessages([...messages,userMessage, { sender: 'bot', text: 'Do you want to create a User?', continue : true  }]);
            }
          }
        }
      }
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
