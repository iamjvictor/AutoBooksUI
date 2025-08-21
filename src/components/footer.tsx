// src/components/Footer.tsx
import { Instagram, Mail, Phone, Bot } from "lucide-react";

const supportLinks = [
  { name: "Central de Ajuda", href: "#" },
  { name: "Documentação", href: "#" },
  { name: "Contato", href: "#" },
  { name: "Status", href: "#" },
];

const legalLinks = [
    { name: "Termos de Uso", href: "#" },
    { name: "Política de Privacidade", href: "#" },
    { name: "LGPD", href: "#" },
]

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white w-full z-50  shadow-sm" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto px-6 py-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Coluna 1: Logo e Descrição */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🛎️</span>
              <span className="text-2xl font-bold">AutoBooks</span>
            </div>
            <p className="text-gray-300 text-base">
              Automatize o atendimento do seu negócio e aumente suas
              reservas diretas com inteligência artificial.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-teal-400">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400">
                <span className="sr-only">Email</span>
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Colunas 2 e 3: Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                    <h3 className="text-sm font-semibold leading-6">Suporte</h3>
                    <ul role="list" className="mt-6 space-y-4">
                        {supportLinks.map((item) => (
                        <li key={item.name}>
                            <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-teal-400">
                            {item.name}
                            </a>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
                <div>
                    <h3 className="text-sm font-semibold leading-6">Contato</h3>
                    <ul role="list" className="mt-6 space-y-4">
                        <li className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <a href="mailto:contato@atende.ai" className="text-sm text-gray-300 hover:text-teal-400">contato@atende.ai</a>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-300">(11) 9999-9999</span>
                        </li>
                    </ul>
                </div>
            </div>
          </div>
        </div>

        {/* Seção Inferior */}
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs leading-5 text-gray-400 mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} Atende.AI. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6">
            {legalLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-xs leading-5 text-gray-400 hover:text-white">
                    {link.name}
                </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}