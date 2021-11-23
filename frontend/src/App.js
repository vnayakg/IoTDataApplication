import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Route } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Dashboard from './components/Dashboard';
import authToken from './services/authToken';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => setUser(authToken.getUser()), []);

  return (
    <div className="App">
      <ToastContainer autoClose={2500} />
      <Route
        path="/"
        render={(props) => (
          <Dashboard user={user} setUser={setUser} {...props} />
        )}
      />
    </div>
  );
}

export default App;
