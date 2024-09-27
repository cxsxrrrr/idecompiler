import React, { useState, useRef } from "react";
import "./code.css";

const Code = () => {
  const [code, setCode] = useState(""); // Estado para almacenar el código
  const lineCount = code.split("\n").length; // Contar líneas basadas en saltos de línea
  const textareaRef = useRef(null); // Referencia al textarea

  const handleChange = (e) => {
    setCode(e.target.value); // Actualizar el estado del código
  };

  const handleScroll = (e) => {
    // Sincronizar el scroll entre los números de línea y el textarea
    const scrollTop = e.target.scrollTop;
    const lineNumbers = document.querySelector(".line-numbers");
    if (lineNumbers) {
      lineNumbers.scrollTop = scrollTop;
    }
  };

  return (
    <div className="code">
      {/* Contenedor de números de línea */}
      <div className="line-numbers">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1} className="line-number">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Área de texto para el código */}
      <textarea
        className="code__editor"
        value={code} // Valor del textarea enlazado al estado
        onChange={handleChange} // Llamar a la función al cambiar el contenido
        onScroll={handleScroll} // Sincronizar scroll
        spellCheck={false}
        rows={lineCount > 0 ? lineCount : 1} // Ajustar filas dinámicamente
      />
    </div>
  );
};

export default Code;
