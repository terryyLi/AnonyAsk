import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import CreateConversationPage from './pages/CreateConversationPage';
import PostPage from './pages/PostPage';
import CreateAnswerPage from './pages/CreateAnswerPage';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/createPost" element={<CreatePostPage />} />
        <Route path="/createConversation/:postId" element={<CreateConversationPage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/createAnswer/:conversationId/:postId" element={<CreateAnswerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
