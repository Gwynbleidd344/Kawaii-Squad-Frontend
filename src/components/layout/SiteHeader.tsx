import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, User as UserIcon } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export function SiteHeader() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-[#0f1b3d] text-white h-16 shadow-lg">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck className="text-[#c5a059] h-8 w-8" />
          <span className="font-bold text-xl tracking-tight uppercase">e-CIN</span>
        </Link>

        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link to={user.role === 'ADMIN' ? "/admin" : "/cin"} className="hover:text-[#c5a059] transition">
                Tableau de bord
              </Link>
              <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                <span className="text-sm flex items-center gap-2">
                  <UserIcon size={14}/> {user.fullName}
                </span>
                <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="bg-[#c5a059] text-[#0f1b3d] px-4 py-2 rounded-lg font-bold">Connexion</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-gray-100 py-6 border-t mt-auto">
      <div className="text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} République de Madagascar - Ministère de l'Intérieur
      </div>
    </footer>
  );
}