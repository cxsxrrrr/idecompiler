import { useState, useEffect, useRef } from 'react';
import './sidebar.css';
import files from '../assets/icons/files.png';
import IA from '../assets/icons/IA.png';
import run from '../assets/icons/run.png';
import Save from '../assets/icons/Save.png';

function Sidebar({ onFileCreate, onFileOpen, onFileSave, getCurrentFileContent }) {
  const [showCarpetasDropdown, setShowCarpetasDropdown] = useState(false);
  const [showGuardadoDropdown, setShowGuardadoDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal para crear archivo
  const [fileName, setFileName] = useState(''); // Nombre del archivo a crear
  const [showChat, setShowChat] = useState(false); // Estado para controlar la visibilidad de ChatAi
  const [notification, setNotification] = useState({ show: false, message: '', type: '' }); // Notificaciones
  const fileInputRef = useRef(null); // Ref para el input de abrir archivo
  const carpetasRef = useRef(null);
  const guardadoRef = useRef(null);

  // Función para cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (carpetasRef.current && !carpetasRef.current.contains(event.target)) {
        setShowCarpetasDropdown(false);
      }
      if (guardadoRef.current && !guardadoRef.current.contains(event.target)) {
        setShowGuardadoDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [carpetasRef, guardadoRef]);

  const handleOpenChat = () => {

    setShowChat(true); // Esto debería venir de las props del componente App
  };

  // Definición de la función `handleCloseChat`
  const handleCloseChat = () => {
    setShowChat(false);
  };

  // Función para manejar el clic en "Crear Archivo"
  const handleCreateFile = () => {
    setFileName(''); // Restablece el nombre del archivo
    setShowModal(true); // Muestra el modal
  };

  // Función para manejar el clic en "Abrir Archivo"
  const handleOpenFile = () => {
    fileInputRef.current.click(); // Simula el clic en el input oculto
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setFileName(''); // Restablece el nombre del archivo
    setShowModal(false); // Cierra el modal
  };

  // Función para manejar la creación del archivo
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
        handleCloseModal(); // Cierra el modal
      }
    })
    .catch((error) => {
      console.error('Error al crear el archivo:', error);
      showNotification('Ocurrió un error al intentar crear el archivo.', 'error');
    });
  };

  // Función para manejar la apertura del archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result; // Obtener contenido del archivo
        onFileOpen({ name: file.name, content }); // Llama a la función para abrir el archivo
      };
      reader.readAsText(file); // Lee el archivo como texto
    }
  };

  // Función para mostrar notificaciones
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000); // Ocultar la notificación después de 3 segundos
  };

  // Función para manejar el clic en "Guardar"
  const handleSaveFile = () => {
    onFileSave(); // Llama a la función pasada desde el componente padre (App.js)
  };

  // Función para manejar el clic en "Guardar como"
  const handleSaveAs = async () => {
    const currentContent = getCurrentFileContent(); // Obtiene el contenido actual
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: 'nombre_del_archivo.txt',
      types: [{
        description: 'Text Files',
        accept: {
          'text/plain': ['.txt'],
        },
      }],
    });

    const writableStream = await fileHandle.createWritable();
    await writableStream.write(currentContent);
    await writableStream.close();
  };

  return (
    <>
      <aside className="sidebar">
        <div className="navigation">
          <div className="controls">
            <div className="close" />
            <div className="minimize" />
            <div className="fullscreen" />
          </div>
          <div className="text-wrapper">Editor</div>
        </div>

        <div className="sidebar-buttons">
          {/* Botón Carpetas */}
          <div ref={carpetasRef} className="relative sidebar-button">
            <img
              src={files}
              alt="Carpetas"
              onClick={() => setShowCarpetasDropdown(!showCarpetasDropdown)}
            />
            {showCarpetasDropdown && (
              <div className="absolute top-5 left-3 mt-2 w-40 bg-gray-900 rounded shadow-lg">
                <ul className="py-1 text-sm text-white">
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={handleCreateFile}
                  >
                    Crear Archivo
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={handleOpenFile}
                  >
                    Abrir Archivo
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Input oculto para abrir archivos */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {/* Botón Guardado */}
          <div ref={guardadoRef} className="relative sidebar-button">
            <img
              src={Save}
              alt="Guardado"
              onClick={() => setShowGuardadoDropdown(!showGuardadoDropdown)}
            />
            {showGuardadoDropdown && (
              <div className="absolute top-5 left-1 mt-2 w-40 bg-gray-900 rounded shadow-lg">
                <ul className="py-1 text-sm text-white">
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={handleSaveFile}>
                    Guardar
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={handleSaveAs}>
                    Guardar como
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/*! Botón IA */}
          <div className="sidebar-button" onClick={() => window.open('https://gemini.google.com/app', '_blank')}>
  <img src={IA} alt="IA" />
</div>

          {/* Botón Ejecutar */}
          <div className="sidebar-button">
            <img src={run} alt="Ejecutar" />
          </div>
        </div>
      </aside>

      {/* Modal para crear archivo */}
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
                onClick={() => createFileOnBackend(fileName)} // Crea el archivo en el backend
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificación */}
      {notification.show && (
        <div className={`fixed bottom-5 right-5 p-4 bg-${notification.type === 'success' ? 'green-500' : 'red-500'} rounded`}>
          <p className="text-white">{notification.message}</p>
        </div>
      )}
    </>
  );
}

export default Sidebar;
