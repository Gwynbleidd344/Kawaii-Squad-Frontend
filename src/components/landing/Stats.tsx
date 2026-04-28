
const Stats = () => {
  const stats = [
    { value: '240k+', label: 'Citoyens servis' },
    { value: '48h', label: 'Délai moyen' },
    { value: '119', label: 'Fokontany connectés' },
  ];

  return (
    <section className="w-full bg-slate-900 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center md:text-left">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
