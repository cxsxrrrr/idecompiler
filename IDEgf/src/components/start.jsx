import React, { useState, useRef } from 'react';
import './start.css';

const Start = ({ onFileCreate, onFileOpen }) => {
  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal
  const [fileName, setFileName] = useState(''); // Guarda el nombre del archivo
  const [notification, setNotification] = useState({ show: false, message: '', type: '' }); // Maneja notificaciones
  const fileInputRef = useRef(null);

  //! Función para manejar el clic en el cuadrado de "Abrir Archivo"
  const handleOpenFile = () => {
    fileInputRef.current.click(); // Simula el clic en el input
  };

  //! Función para manejar el clic en el cuadrado de "Crear Archivo"
  const handleCreateFile = () => {
    setFileName(''); // Restablece el nombre del archivo
    setShowModal(true); // Muestra el modal
  };

  //! Función para cerrar el modal y restablecer el nombre del archivo
  const handleCloseModal = () => {
    setFileName(''); // Restablece el nombre del archivo al cerrar
    setShowModal(false); // Cierra el modal
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader(); // Crear un nuevo FileReader
      reader.onload = (event) => {
        const content = event.target.result; // Obtener el contenido del archivo
        onFileOpen({ name: file.name, content }); // Llama a la función para abrir el archivo con su contenido
      };
      reader.readAsText(file); // Leer el archivo como texto
    }
  };

  //! Función para manejar la creación del archivo
  const createFileOnBackend = (fileName) => {
    fetch('http://localhost:5000/create-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        showNotification(data.error, 'error');
      } else {
        showNotification(data.message, 'success');
        onFileCreate(fileName); // Llama a la función para actualizar el estado en App
        handleCloseModal(); // Restablece el nombre del archivo y cierra el modal
      }
    })
    .catch((error) => {
      console.error('Error al crear el archivo:', error);
      showNotification('Ocurrió un error al intentar crear el archivo.', 'error');
    });
  };

  //! Función para mostrar notificaciones
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000); // Ocultar la notificación después de 3 segundos
  };

  return (
    <div className='start-container flex justify-center items-center h-screen bg-#2222'>
      {/* Cuadrado para "Crear Archivo" */}
      <div className='square bg-#2222 shadow-lg hover:shadow-xl' onClick={handleCreateFile}>
        Crear Archivo
      </div>

      {/* Cuadrado para "Abrir Archivo" */}
      <div className='square2 bg-#2222 shadow-lg hover:shadow-xl' onClick={handleOpenFile}>
        Abrir Archivo
      </div>

      {/* Input oculto para abrir archivos */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange} 
      />

      {/* Modal para ingresar el nombre del archivo */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#222222] p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4 text-white">Nombre del Archivo</h2>
            <input
              type="text"
              className="w-full border border-gray-500 bg-[#333333] rounded-lg p-2 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Introduce el nombre del archivo..."
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
                onClick={handleCloseModal} // Cierra el modal y restablece el input
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => createFileOnBackend(fileName)} // Llama a la función para crear el archivo en el backend
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Notificación */}
      {notification.show && (
        <div
          className={`fixed bottom-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white 
          ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Start;
