import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './context/AuthContext';
import GlobalStyle from './components/styles/GlobalStyle';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import Videos from './pages/Videos';
import Materials from './pages/Materials';
import Forum from './pages/Forum';
import Calculator from './pages/Calculator';
import Achievements from './pages/Achievements';
import Blog from './pages/Blog';
import Admin from './pages/Admin';

const theme = {
  colors: {
    primary: '#000000',
    secondary: '#1d1d1f',
    accent: '#0071e3',
    light: '#f5f5f7',
    white: '#ffffff',
    gray: '#86868b',
  },
  fonts: {
    main: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  breakpoints: {
    mobile: '768px',
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <GlobalStyle />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;