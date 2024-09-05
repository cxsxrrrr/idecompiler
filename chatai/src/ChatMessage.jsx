import React from 'react';

function ChatMessage({ message, isUser }) {
  const chatClass = isUser ? 'chat-end' : 'chat-start';
  const bubbleClass = isUser ? 'chat-bubble-secondary' : 'chat-bubble chat-bubble-primary'; 
  const imageSrc = isUser
    ? 'https://miro.medium.com/v2/resize:fit:720/1*W35QUSvGpcLuxPo3SRTH4w.png' // Ruta a tu imagen de usuario 
    : 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png'; // Imagen de Gemini

  return (
    <div className={`chat ${chatClass}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Avatar" src={imageSrc} />
        </div>
      </div>
      <div className={`chat-bubble ${bubbleClass}`}>{message}</div>
    </div>
  );
}

export default ChatMessage;