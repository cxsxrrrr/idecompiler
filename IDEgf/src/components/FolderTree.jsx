import { useEffect, useState } from 'react';

function FolderTree({ onFileOpen }) {
  const [files, setFiles] = useState([]);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:5000/list-files');
        const data = await response.json();
        if (response.ok) {
          setFiles(data.files);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error al obtener archivos:", error);
      }
    };

    fetchFiles();
    const interval = setInterval(fetchFiles, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFileClick = (fileName) => {
    fetch(`http://localhost:5000/files/${fileName}`)
      .then(response => response.text())
      .then(content => {
        onFileOpen({ name: fileName, content });
      })
      .catch(err => console.error("Error al abrir archivo:", err));
  };

  const handleDeleteClick = (fileName) => {
    setFileToDelete(fileName);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (fileToDelete) {
      try {
        const response = await fetch(`http://localhost:5000/delete-file/${fileToDelete}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          // Elimina el archivo de la lista local después de confirmación
          setFiles(files.filter(file => file !== fileToDelete));
          setShowModal(false);
          setFileToDelete(null);
        } else {
          console.error('Error al eliminar el archivo');
        }
      } catch (error) {
        console.error('Error al eliminar el archivo:', error);
      }
    }
  };

  return (
    <div className="folder-tree p-5 bg-gray-700 rounded-lg mt-6">
      <h3 className="text-white mb-4">Archivos</h3>
      <ul>
        {files.map((file, index) => (
          <li
            key={index}
            className="relative flex justify-between items-center mb-0.5 p-2 bg-gray-800 text-white hover:bg-gray-600 rounded transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => handleFileClick(file)}
          >
            {file}
            <button
              className="text-red-400 hover:text-red-600 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(file);
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75">
          <div className="bg-gray-800 text-white p-6 rounded shadow-lg text-center">
            <h3 className="text-lg font-bold mb-4">¿Realmente desea eliminar el archivo?</h3>
            <p className="mb-6 text-gray-700">{fileToDelete}</p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                Sí, eliminar
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FolderTree;
