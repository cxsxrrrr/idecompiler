import React, { useState, useRef } from 'react';
import './start.css';

const Start = () => {
  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal
  const [fileName, setFileName] = useState(''); // Guarda el nombre del archivo
  const fileInputRef = useRef(null);

  // Función para manejar el clic en el cuadrado de "Abrir Archivo"
  const handleOpenFile = () => {
    fileInputRef.current.click(); // Simula el clic en el input
  };

  // Función para manejar el clic en el cuadrado de "Crear Archivo"
  const handleCreateFile = () => {
    setFileName(''); // Restablece el nombre del archivo
    setShowModal(true); // Muestra el modal
  };

  // Función para cerrar el modal y restablecer el nombre del archivo
  const handleCloseModal = () => {
    setFileName(''); // Restablece el nombre del archivo al cerrar
    setShowModal(false); // Cierra el modal
  };

  return (
    <div className='start-container flex justify-center items-center h-screen bg-gray-900'>
      {/* Cuadrado para "Crear Archivo" */}
      <div className='square bg-green-500 shadow-lg hover:shadow-xl' onClick={handleCreateFile}>
        Crear Archivo
      </div>

      {/* Cuadrado para "Abrir Archivo" */}
      <div className='square2 bg-blue-500 shadow-lg hover:shadow-xl' onClick={handleOpenFile}>
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
                onClick={handleCloseModal} // Cierra el modal y restablece el input
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                  console.log(`Archivo creado con nombre: ${fileName}`);
                  handleCloseModal(); // Restablece el nombre del archivo y cierra el modal
                }}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Start;
