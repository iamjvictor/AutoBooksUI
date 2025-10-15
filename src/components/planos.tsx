// src/components/Pricing.tsx
"use client";
import { Check, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

import { plans } from "../data/plans";

export default function Pricing() {
  const nav = useRouter();
  return (
    <section id="planos" className=" bg-[#121829] text-white font-sans min-h-screen flex items-center">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
      <div className="relative">
     
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white-900 sm:text-4xl">
          Escolha o <span className="text-teal-600">plano ideal</span>
        </h2>
        <p className="mt-4 text-lg text-white-600">
          Comece pequeno e evolua junto com o seu negócio
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white/5 border border-white/10 rounded-2xl p-3 text-center
    flex flex-col items-center transition-all duration-300 ${
                plan.popular && plan.avaiable ? "border-2 border-teal-600" : "border border-gray-200"
              } ${!plan.avaiable ? "bg-gray-100 opacity-75" : "bg-teal-50"}`}
            >
              {plan.popular && plan.avaiable && (
                <span className="mb-3 inline-block rounded-full bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1">
                  Mais Popular
                </span>
              )}
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-teal-400">{plan.name}</h3>
                {!plan.avaiable && (
                  <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    Em Breve
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-white-600">{plan.slogan}</p>
              <p className="mt-4 text-3xl font-extrabold text-teal-400">{plan.price}</p>

              <ul className="mt-6 space-y-4 flex-1 text-left">
                {plan.features.map((feature, i) => {
                  const isObj = typeof feature !== "string";
                  const text = isObj ? feature.text : feature;
                  const soon = isObj && !feature.avaiable;

                  return (
                    <li key={i} className="flex items-center gap-2 text-white-700">
                      {soon ? (
                        <Clock className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Check className="h-5 w-5 text-teal-600" />
                      )}
                      <span>
                        {text}{" "}
                        {soon && (
                          <span className="ml-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            Em Breve
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

             <button
                className={`mt-8 w-full rounded-xl px-4 py-3 font-semibold shadow-md transition 
                    ${!plan.avaiable 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                      : plan.popular 
                        ? "bg-teal-600 text-white hover:bg-teal-700" 
                        : "bg-teal-400 text-gray-800 hover:bg-teal-600 hover:text-white"
                    }`}
                onClick={() => plan.avaiable && nav.push('/register')}
                disabled={!plan.avaiable}
                >
                {!plan.avaiable ? "Em Breve" : `Assinar ${plan.name}`}
            </button>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
