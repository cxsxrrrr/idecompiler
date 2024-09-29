import "./navbar.css";

function Navbar({ tabs, activeTabIndex, onTabClick, onNewTabClick }) {
  return (
    <nav className="fixed top-0 left-[250px] w-[calc(100%-250px)] h-8 bg-black/20 text-white z-9 flex items-center pl-5 nav">
      <ul className="flex gap-6">
        {tabs.map((tab, index) => (
          <li
            key={tab.id}
            className={`cursor-pointer ${activeTabIndex === index ? 'font-bold' : ''}`}
            onClick={() => onTabClick(index)}
          >
            {tab.type === 'start' ? 'Nuevo Archivo' : tab.id}
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
