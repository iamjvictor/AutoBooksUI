import {Header} from "@/components/header";
import {Hero} from "@/components/hero";
import {Features} from "@/components/funcionalidades";
import HowItWorks from "@/components/comoFunciona";
import Pricing from "@/components/planos";
import Faq from "@/components/FAQ/faq";
import Footer from "@/components/footer";
import { PaymentsSection } from "@/components/PaymentSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center bg-gray-200 justify-center  min-h-screen bg-[#FDFBF7] text-gray-800 font-sans">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <PaymentsSection />
      <Pricing />
      <TestimonialsSection /> {/* Ajuste o caminho se necessário */}  
      <Faq />
      <Footer />

    </main>
  );
}
