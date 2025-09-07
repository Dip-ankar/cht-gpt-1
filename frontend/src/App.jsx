import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const [socket, setsocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, sender: 'user' }]);
      if (socket) {
        socket.emit('ai-massage', input); // emit after adding message
      }
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    const socketInstance = io('http://localhost:3000');
    setsocket(socketInstance);

    socketInstance.on('ai-message-response', (response) => {
      const botMessage = {
        id: Date.now() + 1,
        timestamp: new Date().toLocaleTimeString(),
        text: response,
        sender: 'bot'
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    });

    return () => {
      socketInstance.disconnect(); // cleanup
    };
  }, []);


  return (
    <div className="app-container">
      <div className="chat-container">
        <h1 className="chat-heading">AI ChatBOT</h1>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
