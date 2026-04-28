import { Moon, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3 min-w-[250px]">
        <div className="bg-slate-900 p-2 rounded-lg">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-slate-900 leading-none">e-CIN</span>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">République de Madagascar</span>
        </div>
      </div>

      <div className="flex items-center gap-8 min-w-[250px] justify-center">
        <a href="#" className="px-5 py-2 bg-slate-100 text-slate-900 rounded-full text-sm font-medium">Accueil</a>
        <a href="#" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">Mes demandes</a>
        <a href="#" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">Suivre</a>
      </div>

      <div className="flex items-center gap-4 min-w-[250px] justify-end">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Moon className="w-5 h-5" />
        </button>
        <a href="#" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">Connexion</a>
        <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
          Créer un compte
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
