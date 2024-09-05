import { useState } from 'react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [output, setOutput] = useState('');

  const handleCompile = async () => {
    try {
      const response = await axios.post('http://localhost:5000/compile', { code });
      
      // Mostrar la respuesta en consola para depuración
      console.log("Response data:", response.data);
      
      setMessage(response.data.message);
      setOutput(response.data.output);

      // Mostrar el output en una alerta
      alert(`Output:\n${response.data.output}`);
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred");
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <h1>Mini Compiler</h1>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Escribe tu código aquí"
        rows="10"
        cols="50"
      />
      <br />
      <button onClick={handleCompile}>Compilar</button>
      <p>{message}</p>
      {output && <pre>{output}</pre>}
    </div>
  );
}

export default App;
