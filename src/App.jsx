import React from 'react';
import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import DashboardPreview from './components/DashboardPreview';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-white">
      <Hero />
      <FeatureGrid />
      <DashboardPreview />
      <Footer />
    </div>
  );
}

export default App;
