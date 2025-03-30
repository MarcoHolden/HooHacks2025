import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Recall from './components/Recall';
import FileUpload from './components/FileUpload';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/upload">File Upload</Link></li>
            <li><Link to="/recall">Recall</Link></li>
            {/* ... other links */}
          </ul>
        </nav>

        <Routes>
          <Route exact path="/recall" element={<Recall />} />  {/* Corrected line */}
          <Route path="/upload" element={<FileUpload />} /> {/* Corrected line */}
          {/* ... other routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;