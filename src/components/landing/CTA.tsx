import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="w-full py-24 px-6">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900 rounded-[2rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Prêt à demander votre CIN ?
            </h2>
            <p className="text-slate-400 text-lg">
              Rejoignez les citoyens qui ont déjà sécurisé leur identité.
            </p>
          </div>
          <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-10 py-5 rounded-full font-bold text-xl flex items-center gap-2 transition-all hover:scale-105 shrink-0">
            Commencer maintenant
            <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
