import { Fingerprint, FileText, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: <Fingerprint className="w-6 h-6 text-slate-700" />,
      title: 'Créez votre profil',
      description: 'Inscrivez-vous avec votre email et vos informations d\'état civil.',
    },
    {
      number: '02',
      icon: <FileText className="w-6 h-6 text-slate-700" />,
      title: 'Déposez vos documents',
      description: 'Acte de naissance, photo d\'identité, justificatif — tout en ligne.',
    },
    {
      number: '03',
      icon: <ShieldCheck className="w-6 h-6 text-slate-700" />,
      title: 'Recevez votre CIN',
      description: 'Suivez le dossier en temps réel et retirez votre carte au fokontany.',
    },
  ];

  return (
    <section className="w-full bg-slate-50 py-24">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Comment ça marche</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4">Trois étapes, une seule carte.</h2>
          <p className="text-slate-600 mt-6 max-w-2xl mx-auto text-lg">
            Un parcours entièrement dématérialisé, certifié conforme aux standards de l'administration malgache.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-4 right-8 text-6xl font-bold text-slate-50 opacity-50">
                {step.number}
              </div>
              <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
