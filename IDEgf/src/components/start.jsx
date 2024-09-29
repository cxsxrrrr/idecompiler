import React, { useState, useRef } from 'react';
import './start.css';

const Start = () => {
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);  // Controla el modal de error
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // Guarda el mensaje de error
  const fileInputRef = useRef(null);

  // Función para manejar el clic en el cuadrado de "Abrir Archivo"
  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  // Función para manejar el clic en el cuadrado de "Crear Archivo"
  const handleCreateFile = () => {
    setFileName('');
    setShowModal(true);
  };

  // Función para cerrar el modal y restablecer el nombre del archivo
  const handleCloseModal = () => {
    setFileName('');
    setShowModal(false);
  };

  // Función para cerrar el modal de error
  const handleCloseErrorModal = () => {
    setErrorMessage('');
    setShowErrorModal(false);
  };

  // Función para crear el archivo en el backend
  const createFileInBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/create-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
      });

      if (response.ok) {
        console.log(`Archivo ${fileName} creado exitosamente.`);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Error desconocido al crear el archivo');
        setShowErrorModal(true);  // Mostrar modal de error
      }
    } catch (error) {
      setErrorMessage('Error de conexión con el backend');
      setShowErrorModal(true);  // Mostrar modal de error
      console.error('Error de conexión con el backend:', error);
    }
  };

  return (
    <div className='start-container flex justify-center items-center h-screen bg-gray-900'>
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
        onChange={(e) => console.log(e.target.files[0])}
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
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                  createFileInBackend();
                  handleCloseModal();
                }}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {showErrorModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-red-500 p-4 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-white">Error</h2>
            <p className="text-white mb-4">{errorMessage}</p>
            <div className="flex justify-end">
              <button
                className="bg-white hover:bg-gray-200 text-red-500 font-semibold py-2 px-4 rounded"
                onClick={handleCloseErrorModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Start;
