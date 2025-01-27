// Home.js
import React from 'react';

const Home = () => {
    return (
        <>
            <Hero />
            <Features />
            <HowItWorks />
            <Contact />
        </>
    );
};


const Hero = () => (
  <section id="home" className="h-screen bg-black relative flex items-center justify-center text-center">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-gray-900 opacity-10"></div>
    <div className="relative z-10 text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 animate__animated animate__fadeIn">
        Redefining Mental Health with AI
      </h1>
      <p className="text-xl md:text-2xl mb-6 animate__animated animate__fadeIn animate__delay-1s">
        Experience the future of personalized mental wellness
      </p>
      <a
        href="#contact"
        className="inline-block px-8 py-4 bg-cyan-500 text-black font-bold rounded-full shadow-lg hover:bg-pink-500 transition-all animate__animated animate__fadeIn animate__delay-2s"
      >
        Get Started
      </a>
    </div>
  </section>
);


const Features = () => (
  <section id="features" className="py-16 bg-gray-900 text-white">
    <div className="container mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate__animated animate__fadeIn">
        Cutting-Edge Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: "AI-Powered Analysis", text: "Advanced algorithms for precise mental health assessment" },
          { title: "Real-Time Insights", text: "Instant feedback for patients and therapists" },
          { title: "Multimodal Integration", text: "Comprehensive analysis of facial, vocal, and textual data" },
          { title: "Secure Therapist Portal", text: "Advanced tools for patient monitoring and intervention" },
        ].map((feature, index) => (
          <div
            className={`p-6 bg-gray-800 rounded-lg shadow-lg transform transition-transform hover:-translate-y-2 animate__animated animate__fadeInUp animate__delay-${index}s`}
            key={index}
          >
            <h3 className="text-xl font-bold text-cyan-500 mb-4">{feature.title}</h3>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);


const HowItWorks = () => (
  <section id="how-it-works" className="py-16 bg-gray-800 text-white">
    <div className="container mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate__animated animate__fadeIn">
        The MindLyst Process
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {[
          { number: "01", title: "Data Collection", text: "Secure and non-invasive gathering of multimodal data" },
          { number: "02", title: "AI Processing", text: "Advanced analysis using state-of-the-art AI models" },
          { number: "03", title: "Personalized Insights", text: "Actionable recommendations for improved mental wellness" },
        ].map((step, index) => (
          <div
            className={`max-w-xs text-center p-6 bg-gray-700 rounded-lg shadow-lg animate__animated animate__fadeInLeft animate__delay-${index}s`}
            key={index}
          >
            <div className="text-4xl font-bold text-pink-500 mb-4">{step.number}</div>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);


const Contact = () => (
  <section id="contact" className="py-16 bg-gradient-to-r from-cyan-500 to-pink-500 text-center text-black">
    <div className="container mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 animate__animated animate__fadeIn">
        Ready to Transform Mental Health Care?
      </h2>
      <p className="text-xl md:text-2xl mb-8 animate__animated animate__fadeIn animate__delay-1s">
        Join the AI-driven revolution in mental wellness
      </p>
      <a
        href="#"
        className="inline-block px-8 py-4 bg-black text-white font-bold rounded-full shadow-lg hover:bg-white hover:text-black transition-all animate__animated animate__fadeIn animate__delay-2s"
      >
        Contact Us
      </a>
    </div>
  </section>
);

export default Home;