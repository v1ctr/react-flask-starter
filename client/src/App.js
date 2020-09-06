import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [serverStatus, setServerStatus] = useState('offline');

  useEffect(() => {
    fetch('api/status').then(res => res.json()).then(data => {
      setServerStatus(data.status);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Server is {serverStatus}</p>
      </header>
    </div>
  );
}

export default App;
