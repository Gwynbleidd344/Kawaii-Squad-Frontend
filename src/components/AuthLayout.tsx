import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children, title, subtitle }: any) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Côté Gauche - Branding */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative z-10 text-center">
          <div className="inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur mb-6">
            <ShieldCheck className="h-12 w-12 text-gold" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">e-CIN Madagascar</h1>
          <p className="text-blue-200 text-lg max-w-md">
            Votre identité numérique sécurisée. Un service officiel du Ministère de l'Intérieur.
          </p>
        </div>
      </div>

      {/* Côté Droit - Formulaire */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-display font-bold text-primary mb-2">{title}</h2>
          <p className="text-gray-500 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}