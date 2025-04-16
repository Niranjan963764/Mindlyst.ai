import React, { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";

import { BrowserRouter as Router, Routes, Route } from "react-router";
import QuestionAndAnswer from "./components/QuestionAndAnswer";



const App = () => {

  return (
    // <div>
    //   <Header />
    //   <Home />
    //   <Footer />
    // </div>
    <Router>
      <Header />
      <Routes>
        {/* <Route path="" element={
          <>
            <Header />
            <Home />
            <Footer />
          </>
        }/>
        <Route path="/qna" element={
          <>
            <Header />
            <QuestionAndAnswer />
            <Footer />  
          </>
        } /> */}
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/home" element={<Home />} />
        <Route path="/test" element={<QuestionAndAnswer />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;