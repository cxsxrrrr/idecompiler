import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
        // Validación para evitar mensajes vacíos
        if (userInput.trim() === '') { 
          alert("No puedes enviar mensajes vacíos");
          return; // Si el mensaje está vacío o solo contiene espacios, no hacemos nada
        }
    

    // Agregar mensaje del usuario al estado
    setMessages(prevMessages => [...prevMessages, { text: userInput, isUser: true }]);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();

      // Agregar respuesta de Gemini al estado, conservando los mensajes anteriores
      setMessages(prevMessages => [...prevMessages, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      // Manejo de errores en el frontend
    }

    setUserInput(''); 
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event); 
    }
  };

  const handleReset = async () => {
    setMessages([]); // Limpia el historial en el frontend inmediatamente
    try {
      const response = await fetch('http://localhost:5000/reset_chat', { 
        method: 'POST'
      });

      const data = await response.json();

      if (data.success) {
        setMessages([]); // Limpia el historial en el frontend si el reinicio en Gemini fue exitoso
        console.log('Chat history reset successfully'); 
      } else {
        console.error('Error resetting chat history:', data.message);
        // Puedes mostrar un mensaje de error al usuario si lo deseas
      }
    } catch (error) {
      console.error('Error resetting chat history:', error);
      // Manejo de errores en el frontend
    }
  };
  return (
    <div>

      <div className="card bg-neutral text-neutral-content overflow-y-auto w-[70vw] h-[70vh]">
        <div className="chat-container">
          {/* Chat bubbles */}
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message.text} isUser={message.isUser} />
          ))}
          {/*Fin Chat bubble */}
        </div>
      </div>
      <div className="input-control">
        <input
          type="text"
          placeholder="Manda un mensaje"
          className="input input-bordered w-[60vw] input-with-button"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <button className="btn w-[6vw]" onClick={handleSubmit}>
          Send
        </button>
        <button className="btn btn-outline btn-error w-[3vw] reset" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}

export default App;