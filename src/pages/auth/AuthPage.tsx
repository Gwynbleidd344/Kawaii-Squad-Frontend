import { useState, useRef } from "react";
import { ShieldCheck, Mail, Lock, User, Eye, EyeOff, LogIn, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

function InputField({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  error,
  required,
}: {
  icon?: React.ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1">
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-[#0f1b3d] focus:outline-none focus:ring-2 focus:ring-[#0f1b3d]/10 transition-all ${
            Icon ? "pl-12" : ""
          } ${isPassword ? "pr-12" : ""} ${
            error ? "border-red-300 bg-red-50" : ""
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="px-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const baseClasses =
    "w-full rounded-xl px-6 py-3.5 font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary:
      "bg-[#0f1b3d] text-white hover:bg-[#1a2d5a] shadow-lg shadow-[#0f1b3d]/20 hover:shadow-xl",
    secondary:
      "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    email: "",
    password: "",
  });
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    if (!loginForm.email) newErrors.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) newErrors.email = "Email invalide";
    if (!loginForm.password) newErrors.password = "Mot de passe requis";
    else if (loginForm.password.length < 6) newErrors.password = "Minimum 6 caractères";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors: Record<string, string> = {};
    if (!registerForm.fullName) newErrors.fullName = "Nom complet requis";
    if (!registerForm.fatherName) newErrors.fatherName = "Père requis";
    if (!registerForm.motherName) newErrors.motherName = "Mère requis";
    if (!registerForm.dateOfBirth) newErrors.dateOfBirth = "Date de naissance requise";
    if (!registerForm.placeOfBirth) newErrors.placeOfBirth = "Lieu de naissance requis";
    if (!registerForm.email) newErrors.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(registerForm.email)) newErrors.email = "Email invalide";
    if (!registerForm.password) newErrors.password = "Mot de passe requis";
    else if (registerForm.password.length < 8)
      newErrors.password = "Minimum 8 caractères";
    if (!idPhoto) newErrors.idPhoto = "Photo CIN requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setAuth(data.token, data.user);
      navigate(data.user.role === "ADMIN" ? "/admin" : "/cin");
    } catch (err: unknown) {
      setErrors({ form: err instanceof Error ? err.message : "Erreur de connexion" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    try {
      const formData = new FormData();
      Object.entries(registerForm).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (idPhoto) {
        formData.append("idPhoto", idPhoto);
      }

      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setIsLogin(true);
      setErrors({ form: "Compte créé ! En attente de validation admin." });
    } catch (err: unknown) {
      setErrors({ form: err instanceof Error ? err.message : "Erreur d'inscription" });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 lg:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex rounded-2xl bg-gradient-to-br from-[#0f1b3d] to-[#1a2d5a] p-4 shadow-lg mb-4">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0f1b3d]">
            {isLogin ? "Connexion" : "Inscription"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isLogin
              ? "Accédez à votre espace e-CIN"
              : "Créez votre compte"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 lg:p-8 shadow-[0_8px_40px_-12px_rgba(15,27,61,0.15)]">
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <InputField
                icon={Mail}
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                error={errors.email}
                required
              />
              <InputField
                icon={Lock}
                type="password"
                placeholder="Mot de passe"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                error={errors.password}
                required
              />

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-500 hover:text-[#0f1b3d]"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {errors.form && (
                <p className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-500">
                  {errors.form}
                </p>
              )}

              <Button type="submit">
                <LogIn className="h-5 w-5" />
                Se connecter
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-gray-400">ou</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" type="button">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="secondary" type="button">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </Button>
              </div>

              <p className="mt-4 text-center text-sm text-gray-500">
                Pas de compte ?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setErrors({});
                  }}
                  className="font-semibold text-[#c5a059] hover:underline"
                >
                  S'inscrire
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <InputField
                icon={User}
                type="text"
                placeholder="Nom complet"
                value={registerForm.fullName}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, fullName: e.target.value })
                }
                error={errors.fullName}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  icon={User}
                  type="text"
                  placeholder="Nom du père"
                  value={registerForm.fatherName}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, fatherName: e.target.value })
                  }
                  error={errors.fatherName}
                  required
                />
                <InputField
                  icon={User}
                  type="text"
                  placeholder="Nom de la mère"
                  value={registerForm.motherName}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, motherName: e.target.value })
                  }
                  error={errors.motherName}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  icon={User}
                  type="date"
                  placeholder="Date de naissance"
                  value={registerForm.dateOfBirth}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, dateOfBirth: e.target.value })
                  }
                  error={errors.dateOfBirth}
                  required
                />
                <InputField
                  icon={User}
                  type="text"
                  placeholder="Lieu de naissance"
                  value={registerForm.placeOfBirth}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, placeOfBirth: e.target.value })
                  }
                  error={errors.placeOfBirth}
                  required
                />
              </div>
              <InputField
                icon={Mail}
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
                error={errors.email}
                required
              />
              <InputField
                icon={Lock}
                type="password"
                placeholder="Mot de passe (min 8 caractères)"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                error={errors.password}
                required
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Photo CIN recto
                </label>
                <div
                  onClick={() => photoInputRef.current?.click()}
                  className={`flex items-center justify-center rounded-xl border-2 border-dashed p-4 cursor-pointer transition-colors ${
                    errors.idPhoto
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-[#0f1b3d] hover:bg-gray-50"
                  }`}
                >
                  {idPhoto ? (
                    <div className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">{idPhoto.name}</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">
                        CLIquez pour uploader
                      </p>
                      <p className="text-xs text-gray-400">JPEG, PNG, WebP (max 5MB)</p>
                    </div>
                  )}
                </div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size <= 5 * 1024 * 1024) {
                      setIdPhoto(file);
                    } else if (file) {
                      setErrors({ ...errors, idPhoto: "Fichier max 5MB" });
                    }
                  }}
                />
                {errors.idPhoto && (
                  <p className="px-2 text-xs text-red-500">{errors.idPhoto}</p>
                )}
              </div>

              {errors.form && (
                <p className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-500">
                  {errors.form}
                </p>
              )}

              <Button type="submit">
                <ShieldCheck className="h-5 w-5" />
                Créer mon compte
              </Button>

              <p className="mt-4 text-center text-sm text-gray-500">
                Déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setErrors({});
                  }}
                  className="font-semibold text-[#0f1b3d] hover:underline"
                >
                  Se connecter
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}