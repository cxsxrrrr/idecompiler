import React, { useState, useEffect, useRef } from 'react';  // IMPORTA AQUÍ LOS HOOKS

export default function Terminal({ output, isOpen, onClose, tabs, activeTabIndex }) {
  const [input, setInput] = useState(''); // Hook de estado para el input
  const [history, setHistory] = useState([]); // Hook de estado para el historial de comandos
  const inputRef = useRef(null); // Referencia al input para enfocarlo
  const terminalRef = useRef(null); // Referencia al terminal para el scroll

  useEffect(() => {
    if (isOpen) {
      setHistory((prevHistory) => [...prevHistory, formatOutput(output)]); // Actualiza el historial si el terminal está abierto
    }
  }, [output, isOpen]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Enfoca el input cuando se renderiza
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight; // Hacer scroll hacia abajo cuando se actualiza el historial
    }
  }, [history]);

  const formatOutput = (text) => {
    return text
      .replace(/1. Árbol sintáctico:/g, '<span class="text-red-500">1. Árbol sintáctico</span>')
      .replace(/2. Tokens:/g, '<span class="text-red-500">2. Tokens</span>')
      .replace(/3. Caracteres no numéricos totales:/g, '<span class="text-red-500">3. Caracteres no numéricos totales</span>')
      .replace(/(valores)/g, '<span class="text-purple-500">valores</span>')
      .replace(/(cantidad)/g, '<span class="text-purple-500">cantidad</span>');
  };

  const handleCommand = async (e) => {
    if (e.key === 'Enter') {
      const command = input.trim(); // Obtiene el comando
      setHistory((prevHistory) => [...prevHistory, `guest@localhost:~$ ${command}`]); // Agrega el comando al historial
      if (command === 'clear') {
        setHistory([]); // Limpia el historial
      } else if (command === 'arbol') {
        if (activeTabIndex !== null && tabs[activeTabIndex]) {
          try {
            const response = await fetch('http://localhost:5000/syntax-analysis', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: tabs[activeTabIndex].content }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Error desconocido al obtener el árbol sintáctico');
            }

            const data = await response.json();
            const treeOutput = JSON.stringify(data.parseTree, null, 2);
            setHistory((prevHistory) => [...prevHistory, `<pre>${treeOutput}</pre>`]);
          } catch (error) {
            setHistory((prevHistory) => [
              ...prevHistory,
              `Error al obtener el árbol sintáctico: ${error.message}`,
            ]);
          }
        } else {
          setHistory((prevHistory) => [
            ...prevHistory,
            'Error: No hay una pestaña activa con contenido para analizar.',
          ]);
        }
      } else if (command === 'help') {
        setHistory((prevHistory) => [
          ...prevHistory,
          'Comandos disponibles: help, clear, arbol',
        ]);
      }
      setInput(''); // Limpia el input después de ejecutar el comando
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-[250px] right-0 h-1/2 bg-[#282a36] text-[#f8f8f2] font-mono shadow-lg border-t border-[#6272a4]">
      <div className="flex justify-between items-center p-2 bg-[#44475a] border-b border-[#6272a4]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5555]"></div>
          <div className="w-3 h-3 rounded-full bg-[#f1fa8c]"></div>
          <div className="w-3 h-3 rounded-full bg-[#50fa7b]"></div>
          <span className="ml-2 text-[#f8f8f2]">Terminal</span>
        </div>
        <button
          onClick={onClose}
          className="text-[#f8f8f2] hover:text-[#ff79c6] transition-colors"
        >
          ✕
        </button>
      </div>
      <div ref={terminalRef} className="p-4 h-[calc(100%-40px)] overflow-y-auto">
        {history.map((entry, index) => (
          <div
            key={index}
            className="mb-1 text-[#50fa7b]"
            dangerouslySetInnerHTML={{ __html: entry }}
          />
        ))}
        <div className="flex">
          <span className="text-[#f8f8f2]">guest@localhost:~$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 ml-2 bg-transparent outline-none text-[#f8f8f2]"
          />
        </div>
      </div>
    </div>
  );
}
