import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    console.log(input);
    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    console.log(userMessage);
    try {
    //   const response = await axios.post('https://api.openai.com/v1/completions', {
    //     model: "gpt-3.5-turbo",
    //     prompt: input,
    //     max_tokens: 100,
    //   }, {
    //     headers: {
    //       'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
    //       'Content-Type': 'application/json',
    //     },
    //   });

      const botMessage = { sender: 'bot', text: 'Hi' };
    //   const botMessage = { sender: 'bot', text: response.data.choices[0].text };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
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
