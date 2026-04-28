import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white border-t border-slate-100 py-12"
    >
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          <span>Portail officiel</span>
          <span>·</span>
          <span>Ministère de l'Intérieur</span>
          <span>·</span>
          <span>République de Madagascar</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-900 transition-colors">Mentions légales</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
