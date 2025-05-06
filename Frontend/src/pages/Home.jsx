import React from "react";
import Hero from "../components/Home/Hero";
import Services from "../components/Home/Services";
import InvestmentTypes from "../components/Home/InvestmentTypes";
import Testimonials from "../components/Home/Testimonials";
import JoinUs from "../components/Home/JoinUs";
import FAQ from "../components/Home/FAQ";

function Home() {
  return (
    <div>
      <Hero />
      <Services />
      <InvestmentTypes />
      <JoinUs />
      <Testimonials />
      <FAQ />
    </div>
  );
}

export default Home;
