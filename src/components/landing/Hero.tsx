import { ArrowRight, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const IDCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="relative w-[380px] h-[240px] bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden text-white"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      
      <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">REPUBLIKAN'I MADAGASIKARA</span>
        <div className="bg-amber-500/20 p-2 rounded-lg">
          <Fingerprint className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      <h2 className="text-lg font-bold mb-6">Carte d'Identité Nationale</h2>

      <div className="flex gap-4">
        <div className="w-24 h-32 bg-slate-700/50 rounded-lg flex-shrink-0 border border-white/5"></div>
        <div className="flex flex-col gap-2 text-xs">
          <div>
            <p className="text-slate-400 uppercase text-[8px] font-bold">Nom</p>
            <p className="font-bold text-sm">RAKOTONDRAINIBE</p>
          </div>
          <div>
            <p className="text-slate-400 uppercase text-[8px] font-bold">Prénom</p>
            <p className="font-bold text-sm">Hery</p>
          </div>
          <div>
            <p className="text-slate-400 uppercase text-[8px] font-bold">Né(e) le</p>
            <p className="font-bold text-sm">12 / 04 / 1996</p>
          </div>
          <div>
            <p className="text-slate-400 uppercase text-[8px] font-bold">N° CIN</p>
            <p className="font-bold text-sm">101 234 567 890</p>
          </div>
        </div>
      </div>

      <div className="mt-auto flex justify-between items-end">
        <div>
          <p className="text-slate-400 uppercase text-[8px] font-bold">Valide jusqu'au</p>
          <p className="text-xs font-bold">04 / 2036</p>
        </div>
        <div className="w-10 h-6 bg-amber-500/40 rounded-md"></div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  return (
    <section className="relative w-full min-h-[85vh] bg-[#0f172a] overflow-hidden flex items-center">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium backdrop-blur-sm"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            SERVICE OFFICIEL · RÉPUBLIQUE DE MADAGASCAR
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -left-4 -top-2 w-full h-24 bg-amber-500/20 -z-10 rounded-sm"></div>
            <div className="absolute -left-2 -top-4 w-full h-24 bg-amber-500/10 -z-10 rounded-sm"></div>
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
              Votre identité,
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-300 max-w-lg leading-relaxed"
          >
            Demandez, renouvelez et suivez votre Carte d'Identité Nationale en quelques minutes, depuis n'importe où. Fini les files d'attente.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all hover:scale-105">
              Créer mon identité numérique
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-transparent border border-white/20 hover:bg-white/5 text-white px-8 py-4 rounded-full font-bold text-lg transition-all">
              Suivre une demande
            </button>
          </motion.div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative group">
            <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <IDCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
