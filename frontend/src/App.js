import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/createPost" element={<CreatePostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
