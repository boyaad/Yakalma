


import { Categories } from "../components/home/Categories";
import { CtaSection } from "../components/home/Ctasection";
import { FeaturedDishes } from "../components/home/Featureddish";
import { Hero } from "../components/home/Hero";
import { Testimonials } from "../components/home/Testimoniale";
import { TopChefs } from "../components/home/Topshef";
// import { Footer } from "../components/ui/Footer";


export default function  Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <FeaturedDishes />
      <TopChefs />
      <Testimonials />
      <CtaSection />
      {/* <Footer /> */}
    </div>
  );
} 
