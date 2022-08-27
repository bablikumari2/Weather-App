import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Weather from './components/Weather/Weather';

function App() {
  return (
    <div className="App">
      {/* <Navbar/> */}
      <Weather/>
    </div>
  );
}

export default App;
