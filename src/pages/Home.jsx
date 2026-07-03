import { Categories } from "../components/home/Categories";
import { CtaSection } from "../components/home/Ctasection";
import { FeaturedDishes } from "../components/home/Featureddish";
import { Hero } from "../components/home/Hero";
import { Testimonials } from "../components/home/Testimoniale";
import { TopChefs } from "../components/home/Topshef";
import { ActiveOrderFloatingIndicator } from "../components/profile/ActiveOrderFloatingIndicator";
import { useUserInfo } from "../context/UserInfoContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { commandes } = useUserInfo() || {};

  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <FeaturedDishes />
      <TopChefs />
      <Testimonials />
      <CtaSection />
      <ActiveOrderFloatingIndicator
        orders={commandes}
        onViewOrders={() =>
          navigate("/profile", { state: { activeSection: "orders" } })
        }
      />
    </div>
  );
}
