import Start from './components/start';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar'
import Code from './components/code'
import Footer from './components/footer'
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <Code />
      <Footer/>
    </div>
  );
}

export default App;
