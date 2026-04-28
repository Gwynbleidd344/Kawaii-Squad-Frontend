import { Clock, Lock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: <Clock className="w-6 h-6 text-amber-500" />,
      title: 'Traitement en 48h',
      description: 'Vérification numérique accélérée par nos agents.',
    },
    {
      icon: <Lock className="w-6 h-6 text-amber-500" />,
      title: 'Sécurisé de bout en bout',
      description: 'Chiffrement des documents et authentification forte.',
    },
    {
      icon: <Users className="w-6 h-6 text-amber-500" />,
      title: 'Accessible à tous',
      description: 'Inscription de mineurs via tuteur, interface en français.',
    },
  ];

  return (
    <section className="w-full bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="bg-amber-50 p-4 rounded-full mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
