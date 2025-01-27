import React, { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";

const App = () => {

  return (
    <div>
      <Header />
      {/* <Hero />
      <Features />
      <HowItWorks />
      <Contact /> */}
      <Home />
      <Footer />
    </div>
  );
};

export default App;