import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Dashboard />
    </div>
  );
}

export default App;
