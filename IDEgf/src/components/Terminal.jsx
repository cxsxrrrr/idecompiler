import { useState, useRef, useEffect } from 'react';

export default function Terminal({ output, isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHistory((prevHistory) => [...prevHistory, formatOutput(output)]);
    }
  }, [output, isOpen]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const formatOutput = (text) => {
    return text
      .replace(/1. Árbol sintáctico:/g, '<span class="text-red-500">1. Árbol sintáctico</span>')
      .replace(/2. Tokens:/g, '<span class="text-red-500">2. Tokens</span>')
      .replace(/3. Caracteres no numéricos totales:/g, '<span class="text-red-500">3. Caracteres no numéricos totales</span>')
      .replace(/(valores)/g, '<span class="text-purple-500">valores</span>')
      .replace(/(cantidad)/g, '<span class="text-purple-500">valores</span>')
      .replace(/4. Números/g, '<span class="text-red-500">5. Números</span>')
      .replace(/5. Espacios en blanco/g, '<span class="text-red-500">6. Espacios en blanco</span>');
  };
  

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      if (command) {
        setHistory((prevHistory) => [...prevHistory, `guest@localhost:~$ ${command}`]);
        if (command === 'clear') {
          setHistory([]);
          setInput('');
          return;
        } else if (command === 'help') {
          output = 'Available commands: help, clear, echo, date';
          setHistory((prevHistory) => [...prevHistory, formatOutput(output)]);
          setInput('');
          return;
        } else if (command === 'date') {
          output = new Date().toString();
          setHistory((prevHistory) => [...prevHistory, formatOutput(output)]);
          setInput('');
          return;
        } else if (command.startsWith('echo ')) {
          output = command.slice(5);
          setHistory((prevHistory) => [...prevHistory, formatOutput(output)]);
          setInput('');
          return;
        }
      }
      setInput(''); // Limpia el input después de enviar el comando
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
      <div
        ref={terminalRef}
        className="p-4 h-[calc(100%-40px)] overflow-y-auto"
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-1 text-[#50fa7b]" dangerouslySetInnerHTML={{ __html: entry }} />
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
