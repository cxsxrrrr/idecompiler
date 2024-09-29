import './sidebar.css';
import files from '../assets/icons/files.png';
import IA from '../assets/icons/IA.png';
import run from '../assets/icons/run.png';
import Save from '../assets/icons/Save.png';
function Sidebar() {
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
          <div className="sidebar-button" title="Carpetas">
            <img src= {files} alt="Carpetas" />
          </div>
          <div className="sidebar-button" title="Guardado">
          <img src= {Save} alt="Guardado" />
          </div>
          <div className="sidebar-button" title="IA">
          <img src= {IA} alt="IA" />
          </div>
          <div className="sidebar-button" title="Ejecutar">
          <img src= {run} alt="Ejecutar" />
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
