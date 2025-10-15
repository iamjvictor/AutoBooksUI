// src/components/TestimonialsSection.tsx
import Image from 'next/image';
import React from 'react';

// Dados dos depoimentos
const testimonials = [
  {
    id: 1,
    quote:
      "Desde que comecei a usar o AutoBooks, meu tempo respondendo WhatsApp diminuiu em 80% e minhas reservas diretas aumentaram significativamente. É como ter um recepcionista extra que nunca dorme!",
    author: 'Joana Silva',
    title: 'Gerente, Pousada Recanto do Mar',
    image: '/avatar-joana.jpg', // Caminho da imagem de Joana
  },
  {
    id: 2,
    quote:
      "A automação do WhatsApp transformou a forma como interagimos com nossos hóspedes. As dúvidas são respondidas na hora e a experiência do cliente melhorou demais. Recomendo a todos!",
    author: 'Carlos Alberto',
    title: 'Proprietário, Hotel Vista Alegre',
    image: '/avatar-carlos.jpg', // Caminho da imagem de Carlos
  },
  {
    id: 3,
    quote:
      "Antes do AutoBooks, perdíamos muitas reservas por não conseguir responder a tempo. Agora, a IA cuida de tudo e o Google Calendar mantém nossa agenda impecável. Incrível!",
    author: 'Maria Fernanda',
    title: 'Administradora, Flats do Sol',
    image: '/avatar-maria.jpg', // Caminho da imagem de Maria
  },
];

export const TestimonialsSection = () => {
  return (
    <section className=" bg-[#121829] text-white font-sans min-h-screen flex items-center">
     <div className="w-full  mx-auto px-6 lg:px-8 py-24 sm:py-32">
       
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white-800 sm:text-5xl tracking-tight text-center mt900 mb-4">
            O que nossos parceiros estão <span className="text-teal-600">dizendo</span>
          </h2>
          <p className="text-xl text-white-600 mb-16 max-w-2xl mx-auto">
            Veja como o AutoBooks está transformando a gestão e o atendimento em hotéis e pousadas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
              {/* Citação */}
              <p className="text-lg text-gray-700 italic mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Imagem e Dados do Autor */}
              <div className="flex items-center mt-auto">
                {/* Garantindo que a div externa seja quadrada para o rounded-full funcionar melhor */}
                <div className="w-16 h-16 flex-shrink-0 mr-4 rounded-full overflow-hidden border-2 border-teal-600">
                  <Image
                    src={testimonial.image}
                    alt={`Foto de ${testimonial.author}`}
                    width={64} // Mantendo 64x64 como tamanho intrínseco
                    height={64}
                    className="w-full h-full object-cover" // Isso é crucial: garante que a imagem preencha a div quadrada e seja cortada se não for 1:1
                  />
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-teal-600">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};