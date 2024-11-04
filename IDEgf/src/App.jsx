import React, { useState } from 'react';
import Start from './components/start';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import Code from './components/code';
import Footer from './components/footer';
import Terminal from './components/terminal';
import './App.css';

function App() {
  const [tabs, setTabs] = useState([]); // Inicializa sin pestañas
  const [activeTabIndex, setActiveTabIndex] = useState(null); // Índice de la pestaña activa
  const [syntaxTree, setSyntaxTree] = useState(null);
  const [showTerminal, setShowTerminal] = useState(false); // Estado para mostrar el terminal
  const [terminalOutput, setTerminalOutput] = useState(''); // Estado para el contenido del terminal
  // Función para agregar una nueva pestaña
  const handleNewTab = () => {
    const newTab = { type: 'start', id: Date.now(), content: '' }; // Cada pestaña tiene su contenido
    setTabs([...tabs, newTab]); // Agregar nueva pestaña al estado
    setActiveTabIndex(tabs.length); // Cambiar a la nueva pestaña
  };

  // Función para cambiar de pestaña
  const handleTabClick = (index) => {
    setActiveTabIndex(index); // Cambiar a la pestaña seleccionada
  };

  // Función para abrir un archivo y crear una pestaña para él
  const handleFileOpen = (file) => {
    const newTabs = tabs.filter(tab => tab.type !== 'start'); // Eliminar la pestaña de 'start' si existe
    const newTab = { type: 'code', id: file.name, content: file.content }; // Crear nueva pestaña con el archivo
    setTabs([...newTabs, newTab]); // Agregar nueva pestaña al estado
    setActiveTabIndex(newTabs.length); // Cambiar a la nueva pestaña
  };

  // Función para crear un archivo y crear una pestaña para él
  const handleFileCreate = (fileName) => {
    const newTabs = tabs.filter(tab => tab.type !== 'start'); // Eliminar la pestaña de 'start' si existe
    const newTab = { type: 'code', id: fileName, content: '' }; // Crear nueva pestaña con el nuevo archivo
    setTabs([...newTabs, newTab]); // Agregar nueva pestaña al estado
    setActiveTabIndex(newTabs.length); // Cambiar a la nueva pestaña
  };

  // Función para actualizar el contenido de una pestaña
  const handleCodeChange = (index, newContent) => {
    const updatedTabs = [...tabs];
    updatedTabs[index].content = newContent; // Actualiza el contenido de la pestaña
    setTabs(updatedTabs); // Actualiza el estado con las pestañas modificadas
  };

  // Función para cerrar una pestaña
  const handleTabClose = (index) => {
    const updatedTabs = tabs.filter((_, i) => i !== index); // Eliminar pestaña de la lista
    setTabs(updatedTabs);
    
    if (index === activeTabIndex) {
      setActiveTabIndex(null); // Si cierras la pestaña activa, desactiva el índice
    } else if (index < activeTabIndex) {
      setActiveTabIndex((prevIndex) => prevIndex - 1); // Ajustar índice si cierras una pestaña anterior
    }
  };

  // Función para manejar el guardado del archivo
  const handleFileSave = () => {
    if (activeTabIndex !== null) {
      const currentTab = tabs[activeTabIndex];
      const currentContent = currentTab.content; // Asegurarse de usar el contenido actual
  
      // Enviar el contenido del archivo al backend para guardarlo
      fetch('http://localhost:5000/save-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: currentTab.id, // Nombre del archivo
          content: currentContent,  // Contenido del archivo
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error("Error al guardar el archivo en el backend:", data.error);
          } else {
            console.log("Archivo guardado exitosamente en el backend.");
          }
        })
        .catch(error => {
          console.error("Error al comunicarse con el backend:", error);
        });
    }
  };

  // Función para manejar "Guardar como"
  const handleFileSaveAs = () => {
    if (activeTabIndex !== null) {
      const currentTab = tabs[activeTabIndex];
      const currentContent = currentTab.content; // Definir correctamente el contenido actual
  
      // Crear un blob para descargar localmente
      const blob = new Blob([currentContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = currentTab.id; // Usa el id (nombre del archivo) como nombre del archivo descargado
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Libera la URL
  
      // Enviar el contenido del archivo al backend para sobrescribirlo
    }
  };


// App.jsx
const handleAnalyzeCode = async () => {
  try {
    const response = await fetch('http://localhost:5000/analyze-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: tabs[activeTabIndex].content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error desconocido');
    }

    const data = await response.json();
    const parseTreeOutput = JSON.stringify(data.parseTree, null, 2);
    const tokensOutput = JSON.stringify(data.tokens, null, 2);
    
    setTerminalOutput(`1. Árbol sintáctico:\n${parseTreeOutput}\n\n` +
      `2. Tokens:\n${tokensOutput}\n\n` +
      `3. Caracteres no numéricos totales: (cantidad) ${data.totalCharacters}\n` +
      `   (valores) ${JSON.stringify(data.characters)}\n\n` +
      `4. Números (cantidad): ${data.numbers.length} (valores) ${data.numbers.join(', ')}\n\n` +
      `5. Espacios en blanco (cantidad): ${data.whitespaceCount}`);
    setShowTerminal(false);
    setTimeout(() => setShowTerminal(true), 0);
  } catch (error) {
    setTerminalOutput(`Error al analizar el código: ${error.message}`);
    setShowTerminal(false);
    setTimeout(() => setShowTerminal(true), 0);
  }
};




  const handleRunCode = () => {
    handleAnalyzeCode();
  };

  

  // Nueva función para obtener el contenido del archivo actual
  const getCurrentFileContent = () => {
    return activeTabIndex !== null ? tabs[activeTabIndex].content : ''; // Devuelve el contenido del archivo actual o vacío
  };

  return (
    <div className="app-container">

      <Navbar
        tabs={tabs}
        activeTabIndex={activeTabIndex}
        onTabClick={handleTabClick}
        onNewTabClick={handleNewTab}
        onTabClose={handleTabClose} // Añadimos la opción de cerrar una pestaña
      />
      <Sidebar 
        onFileCreate={handleFileCreate} 
        onFileOpen={handleFileOpen} 
        onFileSave={handleFileSave} 
        onFileSaveAs={handleFileSaveAs}
        onRunCode={handleRunCode}
        getCurrentFileContent={getCurrentFileContent} // Pasa la función aquí
      />
      {activeTabIndex !== null && tabs[activeTabIndex] ? (
        tabs[activeTabIndex].type === 'start' ? (
          <Start
            onFileCreate={handleFileCreate}
            onFileOpen={handleFileOpen}
          />
        ) : (
          <Code
            initialCode={tabs[activeTabIndex].content}
            onCodeChange={(newContent) =>
              handleCodeChange(activeTabIndex, newContent)
            }
          />
        )
      ) : (
        <div className="no-tab-message"></div>
      )}
      <Footer />
      <Terminal 
          output={terminalOutput} 
          isOpen={showTerminal}
          onClose={() => setShowTerminal(false)}
        />
    </div>
    
  );
}

export default App;