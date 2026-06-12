import React from "react";
import Footer from "../components/Footer";
import Reviews from "../components/Reviews";
import Hero from "../components/Hero";
import HowToUse from "../components/HowToUse";
import ShowcaseFeatures from "../components/ShowcaseFeatures";
import BetaPopup from "../components/BetaPopup";

const Home = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white antialiased">
      {/* Beta popup on first visit */}
      <BetaPopup />

      <main>
        {/* Hero */}
        <Hero />

        {/* How to Use */}
        <HowToUse />

        {/* Features Showcase */}
        <ShowcaseFeatures />

        {/* Reviews */}
        <Reviews />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
