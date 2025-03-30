import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Recall from './components/Recall';

const App = () => {
  const [fileProcessed, setFileProcessed] = useState(false);  // This will track if the file has been processed

  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav style={{ background: '#282c34', padding: '10px', textAlign: 'center' }}>
          <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center' }}>
            <li style={{ margin: '0 15px' }}>
              <Link to="/upload" style={linkStyle}>Upload File</Link>
            </li>
            <li style={{ margin: '0 15px' }}>
              <Link to="/recall" style={linkStyle}>Recall Page</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/upload" element={<FileUpload setFileProcessed={setFileProcessed} />} />
          {/* If file is processed, navigate to Recall page */}
          <Route path="/recall" element={fileProcessed ? <Recall /> : <Navigate to="/upload" />} />
        </Routes>
      </div>
    </Router>
  );
};

const linkStyle = {
  color: '#61dafb',
  textDecoration: 'none',
  fontSize: '18px',
  fontWeight: 'bold',
};

export default App;