"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Crown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const images = [
  "https://blog.ucpel.edu.br/wp-content/uploads/2023/05/pexels-pavel-danilyuk-8061570-3840x2160-25fps_AdobeExpress.gif", // Escritório de advocacia moderno
  "https://blog.ucpel.edu.br/wp-content/uploads/2023/05/pexels-pavel-danilyuk-8061570-3840x2160-25fps_AdobeExpress.gif"  // Documentos jurídicos e martelo
];

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">

      {/* 🔁 Background com efeito de entrada */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src={images[0]}
          alt="Escritório Jurídico Moderno"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <motion.img
          src={images[1]}
          alt="Documentos e Serviços Jurídicos"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 3, delay: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none"
        />
      </div>

      {/* 🔮 Efeitos extras animados */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 md:w-72 md:h-72 bg-black-400/20 rounded-full blur-3xl animate-pulse"
          whileHover={{ scale: 1.1 }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-48 h-48 md:w-96 md:h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"
          whileHover={{ scale: 1.05 }}
        />
      </motion.div>

      {/* 🎯 Conteúdo central com animação */}
      <motion.div
        className="container mx-auto px-4 relative z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <motion.div
              className="relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-black from-black-400 to-black-300 rounded-full blur-xl opacity-30 animate-pulse" />
              <div className="relative p-3 md:p-4 bg-gradient-to-br from-black to-black-500 rounded-full shadow-luxury">
                <img src="/logowz.png" alt="Logo DevTools" className="h-32 w-auto" />
                <span className="text-white block font-bold">DevTools</span>
              </div>
            </motion.div>
          </div>

          <p className="font-elegant text-lg md:text-xl text-gray-300 mb-3 max-w-2xl mx-auto">
            Advocacia Especializada e Consultoria Jurídica
          </p>
          <p className="font-elegant text-sm md:text-base text-gray-400 mb-8 max-w-xl mx-auto">
            Direito Civil, Empresarial, Trabalhista, Contratos e Consultoria Jurídica Completa
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/products">
              <Button
                size="lg"
                className="w-full sm:w-auto group relative overflow-hidden bg-white from-black-400 to-green-500 hover:from-black-500 hover:to-green-600 text-black font-elegant font-semibold px-8 py-3 text-base rounded-full shadow-luxury hover:shadow-luxury-hover transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Ver Serviços
              </Button>
            </Link>

            <Link href="/auth">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto group border-2 border-black-400/50 text-black-400 hover:bg-black-400/10 font-elegant font-semibold px-8 py-3 text-black rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-black-400"
              >
                <Crown className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </Link>


          </div>

          {/* Áreas de atuação */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-gray-400 text-xs">
            {[
              { nome: "OAB", cor: "green-400" },
              { nome: "Tribunais", cor: "red-400" },
              { nome: "Cartórios", cor: "blue-400" },
              { nome: "Órgãos Públicos", cor: "yellow-400" },
            ].map((m, i) => (
              <motion.div
                key={m.nome}
                className="flex items-center gap-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + i * 0.2 }}
              >
                <div className={`w-1.5 h-1.5 bg-${m.cor} rounded-full animate-pulse`} />
                <span className="font-elegant">{m.nome}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gradiente inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-20" />
    </section>
  );
}