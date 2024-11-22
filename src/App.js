import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@fontsource/roboto';
import Sidenav from './components/Sidenav';

function App() {
  return (
    <Router>
      <Sidenav />
    </Router>
  );
}

export default App;
