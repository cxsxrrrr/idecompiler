import "./navbar.css";

function Navbar({ tabs, activeTabIndex, onTabClick, onNewTabClick, onTabClose }) {
  return (
    <nav className="fixed top-0 left-[250px] w-[calc(100%-250px)] h-8 bg-black/20 text-white z-9 flex items-center pl-5 nav">
      <ul className="flex gap-6">
        {tabs.map((tab, index) => (
          <li
            key={tab.id}
            className={`relative cursor-pointer flex items-center ${activeTabIndex === index ? 'font-bold' : ''} `}
            onClick={() => onTabClick(index)}
          >
            <span>{tab.type === 'start' ? 'Nuevo Archivo' : tab.name}</span>
            
            {/* Botón para cerrar la pestaña */}
            <button
              className="close-tab-button absolute right-[-15px] text-gray-500 hover:text-gray-300" // Estilo actualizado
              onClick={(e) => {
                e.stopPropagation(); // Evita que el evento de clic en la "X" active la pestaña
                onTabClose(index); // Cerrar pestaña
              }}
            >
              &times;
            </button>
          </li>
        ))}
        <li onClick={onNewTabClick}>
          <div className="cursor-pointer mas">
            <span className="text-white text-lg">+</span>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;