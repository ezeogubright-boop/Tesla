import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import Footer from './components/Footer';
import { ShowroomPage } from './components/Showroom';
import { HeroSection } from './sections/HeroSection';
import { VideoSection } from './sections/VideoSection';
import { StatsSection } from './sections/StatsSection';
import { UnbreakableSection } from './sections/UnbreakableSection';
import { CTASection } from './sections/CTASection';
import './orbitron.css';
import './App.css';

function HomePage() {
  return (
    <div className="relative bg-black min-h-screen">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Video Section */}
        <VideoSection />
        
        {/* Stats Section */}
        <StatsSection />
        
        {/* Unbreakable Section */}
        <UnbreakableSection />
        
        {/* CTA Section */}
        <CTASection />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/showroom" element={<ShowroomPage />} />
      </Routes>
    </Router>
  );
}

export default App;
