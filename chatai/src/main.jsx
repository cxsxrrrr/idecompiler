import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Asegúrate de que este archivo exista
import App from './App';

import 'tailwindcss/tailwind.css' // Importa los estilos de Tailwind CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <button class="btn btn-primary volver">Volver</button>
    <App />
  </React.StrictMode>   

);