import "./code.css";

const Code = () => {
  return (
    <>
      <div className="code">
        <div
          className="code__editor"
          contentEditable={true}
          spellCheck={false}
          style={{
            whiteSpace: "pre-wrap",
            padding: "10px",
            minHeight: "150px",
            outline: "none", // Quitar el borde
          }}
        />
      </div>
    </>
  );
};

export default Code;
