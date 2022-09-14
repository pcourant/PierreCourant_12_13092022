import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Setting from './pages/Setting';
import Community from './pages/Community';
import Error404 from './pages/Error404';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="user/:id" element={<Profile />} />
          <Route path="setting" element={<Setting />} />
          <Route path="community" element={<Community />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
