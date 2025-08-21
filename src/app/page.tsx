import {Header} from "@/components/header";
import {Hero} from "@/components/hero";
import {Features} from "@/components/funcionalidades";
import HowItWorks from "@/components/comoFunciona";
import Pricing from "@/components/planos";
import Faq from "@/components/FAQ/faq";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#FDFBF7] text-gray-800 font-sans">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Faq />
      <Footer />

    </main>
  );
}
