import React, { useState } from 'react';
import Start from './components/start';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import Code from './components/code';
import Footer from './components/footer';
import './App.css';

function App() {
  const [tabs, setTabs] = useState([]); // Inicializa sin pestañas
  const [activeTabIndex, setActiveTabIndex] = useState(null); // Índice de la pestaña activa

  const handleNewTab = () => {
    const newTab = { type: 'start', id: Date.now() }; // Crear nueva pestaña con tipo 'start'
    setTabs([...tabs, newTab]); // Agregar nueva pestaña al estado
    setActiveTabIndex(tabs.length); // Cambiar a la nueva pestaña
  };

  const handleTabClick = (index) => {
    setActiveTabIndex(index); // Cambiar a la pestaña seleccionada
  };

  const handleFileOpen = (file) => {
    const newTabs = tabs.filter(tab => tab.type !== 'start'); // Eliminar la pestaña de 'start' si existe
    const newTab = { type: 'code', id: file.name, content: file.content }; // Crear nueva pestaña con el archivo
    setTabs([...newTabs, newTab]); // Agregar nueva pestaña al estado
    setActiveTabIndex(newTabs.length); // Cambiar a la nueva pestaña
  };

  const handleFileCreate = (fileName) => {
    const newTabs = tabs.filter(tab => tab.type !== 'start'); // Eliminar la pestaña de 'start' si existe
    const newTab = { type: 'code', id: fileName, content: "" }; // Crear nueva pestaña con el nuevo archivo
    setTabs([...newTabs, newTab]); // Agregar nueva pestaña al estado
    setActiveTabIndex(newTabs.length); // Cambiar a la nueva pestaña
  };

  return (
    <div className="app-container">
      <Navbar
        tabs={tabs}
        activeTabIndex={activeTabIndex}
        onTabClick={handleTabClick}
        onNewTabClick={handleNewTab}
      />
      <Sidebar />
      {activeTabIndex !== null && ( // Solo renderiza si hay una pestaña activa
        tabs[activeTabIndex].type === 'start' ? (
          <Start 
            onFileCreate={(fileName) => {
              handleFileCreate(fileName);
            }}
            onFileOpen={handleFileOpen} 
          />
        ) : (
          <Code initialCode={tabs[activeTabIndex].content} />
        )
      )}
      <Footer />
    </div>
  );
}

export default App;
