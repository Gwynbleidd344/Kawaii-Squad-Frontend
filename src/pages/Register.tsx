import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { apiRequest } from "../lib/api";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", fatherName: "", motherName: "", 
    dateOfBirth: "", placeOfBirth: ""
  });
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = new FormData();
    Object.entries(formData).forEach(([k, v]) => body.append(k, v));
    if (file) body.append("idPhoto", file);

    try {
      await apiRequest("/auth/register", { method: "POST", body, isMultipart: true });
      alert("Compte créé ! En attente de validation par l'administration.");
      navigate("/login");
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <AuthLayout title="Créer un compte" subtitle="Remplissez vos informations officielles">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-3 border rounded" placeholder="Nom Complet" onChange={e => setFormData({...formData, fullName: e.target.value})} required />
        <div className="grid grid-cols-2 gap-4">
          <input className="p-3 border rounded" placeholder="Père" onChange={e => setFormData({...formData, fatherName: e.target.value})} />
          <input className="p-3 border rounded" placeholder="Mère" onChange={e => setFormData({...formData, motherName: e.target.value})} />
        </div>
        <input type="date" className="w-full p-3 border rounded" onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} required />
        <input className="w-full p-3 border rounded" placeholder="Lieu de naissance" onChange={e => setFormData({...formData, placeOfBirth: e.target.value})} />
        <input type="email" className="w-full p-3 border rounded" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input type="password" className="w-full p-3 border rounded" placeholder="Mot de passe" onChange={e => setFormData({...formData, password: e.target.value})} required />
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo de votre CIN physique</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
        </div>

        <button type="submit" className="w-full bg-primary text-white p-3 rounded-lg font-bold hover:bg-opacity-90 transition">
          S'inscrire
        </button>
      </form>
    </AuthLayout>
  );
}