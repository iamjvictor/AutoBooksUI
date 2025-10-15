import {Header} from "@/components/header";
import {Hero} from "@/components/hero";
import {Features} from "@/components/funcionalidades";
import HowItWorks from "@/components/comoFunciona";
import Pricing from "@/components/planos";
import Faq from "@/components/FAQ/faq";
import Footer from "@/components/footer";
import  PartnersSection from "@/components/PaymentSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";

export default function HomePage() {
  return (
    <main className="">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <PartnersSection />
      <Pricing />
      <TestimonialsSection /> {/* Ajuste o caminho se necessário */}  
      <Faq />
      <Footer />

    </main>
  );
}
