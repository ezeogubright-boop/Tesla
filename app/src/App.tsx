import { Navigation } from './components/Navigation';
import Footer from './components/Footer';
import { HeroSection } from './sections/HeroSection';
import { VideoSection } from './sections/VideoSection';
import { StatsSection } from './sections/StatsSection';
import { UnbreakableSection } from './sections/UnbreakableSection';
import { CTASection } from './sections/CTASection';
import './orbitron.css';
import './App.css';

function App() {
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

export default App;
