import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/layout/ScrollProgress';
import ChatBot from './components/chatbot/ChatBot';
import Home from './pages/Home';
import AdminPage from './pages/Admin';
import NotFoundPage from './pages/NotFound';
import { useTheme } from './hooks/useTheme';
import { initEasterEggs } from './utils/easterEggs';

function AppContent({ theme }: { theme: string }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`relative min-h-screen ${theme}`} style={{ background: 'var(--color-bg)' }}>
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />
      
      {/* Scroll progress bar - only on public portfolio */}
      {!isAdmin && <ScrollProgress />}
      
      {/* Navigation - only on public portfolio */}
      {!isAdmin && <Navbar />}
      
      {/* Routes */}
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      {/* Footer - only on public portfolio */}
      {!isAdmin && <Footer />}
      
      {/* AI Chatbot - only on public portfolio */}
      {!isAdmin && <ChatBot />}
      
      {/* Toast notifications */}
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: '#0D0D14',
            color: '#F0F0F5',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Only dark theme is used now
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  useEffect(() => {
    // Init easter eggs
    initEasterEggs();
    
    // Loading screen timer
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <AppContent theme={theme} />
    </Router>
  );
}

export default App;
